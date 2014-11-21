###
# Filtree plugin
# @version 0.2.0
# @author Vivek Kumar Bansal <contact@vkbansal.me>
###
((factory)->
    if typeof define is 'function' and define.amd
        define(['jquery'], factory)
    else
        factory(jQuery)
    return
)(($) ->

    ###
    #  Utility functions
    ###

    $.fn.check = ->
        @each(->
            $(@).prop('indeterminate', false).prop('checked' ,true)
    )

    $.fn.uncheck = ->
        @each(->
            $(@).prop('indeterminate', false).prop('checked' ,false)
    )

    $.fn.semicheck = ->
        @each(->
            $(@).prop('indeterminate', true).prop('checked' ,false)
    )

    $.fn.togglecheck = ->
        @each(->
            e = $(@)
            e.prop('checked', not e.prop('checked'))
        )

    ###
    # Default options
    # @option data             [Array]   The Data to be displayed
    # @option ajax             [Boolean] Determines if data is to be fetched via AJAX
    # @option url              [String]  URL to be used for AJAX call
    # @option requestSettings  [Object]  Ajax settings that are to be used while making the ajax call
    # @option animationSpeed   [Number]
    # @option hideFiles        [Boolean]
    # @option fileNodeName     [String]
    # @option folderNodeName   [String]
    # @option fileNodeTitle    [String]
    # @option folderNodeTitle  [String]
    # @option nodeFormatter    [Function]
    # @option columnView       [Boolean]
    # @option dblclickDelay    [Number]
    # @option classes.arrow    [String]
    # @option checkboxes       [Boolean]
    # @option hierarchialCheck [Boolean]
    ###
    defaults =
        data: []
        ajax: false
        url: "./"
        requestSettings: {}
        responseHandler: (data)-> data
        animationSpeed : 400
        hideFiles: false
        fileNodeName: 'name'
        folderNodeName: 'name'
        fileNodeTitle: 'name'
        folderNodeTitle: 'name'
        nodeFormatter: (node)-> node
        columnView: false
        dblclickDelay: 200
        classes:
            arrow: "glyphicon glyphicon-chevron-right"
        
        checkboxes: false
        hierarchialCheck: true
    
    ###
    # FileTree Class Definition
    ###
    class FileTree
        constructor: (@element, options) ->

            @VERSION = '0.2.0'

            @settings = $.extend({}, defaults, options)
            @_defaults = defaults

            @_clicks = 0
            @_timer = null

            # override inter-dependent settings
            @settings.checkboxes = if @settings.columnView then false
            #@settings.hierarchialCheck = unless @settings.checkboxes then false

            @_init()

        ###
        # Public Methods
        ###

        ###
        # Opens a folder, applicable for both modes
        # @param elem [HTMLObject] folder to be opened
        # @return [Object] this
        ###
        open:(elem)->
            $parent = $(elem).closest('li')

            unless $parent.hasClass('folder')
                return false

            @_openFolder($parent)
            
            return @

        ###
        # Closes a folder, applicable for both modes
        # @param elem [HTMLObject] folder to be opened
        # @return [Object] this
        ###
        close:(elem)->
            $parent = $(elem).closest('li')

            unless $parent.hasClass('folder')
                return false
            
            @_closeFolder($parent)
            
            return @

        ###
        # Toggles a folder, applicable only for list/tree mode
        # @param elem [HTMLObject] folder to be toggled
        # @return [Object] this
        ###
        toggle:(elem)->
            unless @settings.columnView
 
                $parent = $(elem).closest('li')
                
                if $parent.hasClass('is-collapsed')
                    @_openFolder($parent)
                else if $parent.hasClass('is-expanded')
                    @_closeFolder($parent)
            
            return @

        ###
        # Selects/Highlights given node
        # @param elem [HTMLObject] node to be highlighted
        # @return [Object] this
        ###
        select:(elem)->
            @_selectItem($(elem).closest('li'))
            
            if @settings.checkboxes
                $(elem).siblings('input[type=checkbox]').togglecheck().change()
            
            return @

        ###
        # Returns selected nodes, only if multiselect is true
        # @returns [Array, Boolean] Array if multiselect is set to true else false
        ###
        getSelectedNodes: ->
            if @settings.checkboxes
                $(@element).find('input[type=checkbox]:checked')
                    .map((i,e)-> $(e).siblings('a')).get()
            false

        ###
        # Gives current selected path based on '.active'
        # @returns [String] Current active path
        ###
        getActivePath: ->
            if @settings.columnView
                parents = $(@element).find('.active')
            else
                parents = $(@element).find('.active > a').parentsUntil(@element, "li.folder")

            parents = parents.map((i,e)-> $(e).find('> a').text()).get()
            parents.reverse() unless @settings.columnView
            parents.join('/')
        
        ###
        # Expands a folder to given path
        # @param path [String]
        # @throws Error if folder is not found
        # @returns [Object] this
        ###
        expandTo: (path)->
            path = path.replace(/^\/|\/$/g,"").split('/')
            $root = $(@element)
            if @settings.columnView
                $root = $root.find('> .list-group-wrapper')
                for context,index in path
                    elem = $root.find("> .columns").eq(index)
                        .find('> ul.list-group > li.folder > a')
                        .filter(-> $(this).text() is context)
                    if elem.length < 1
                        throw new Error("The folder #{context} does not exists")
                    else
                        @open(elem.eq(0))
            else
                @collapseAll(true)
                for context,index in path
                    $root = $root.find('> ul.list-group > li.folder')
                        .filter(-> $(this).find('> a').text() is context)

                    if $root.length < 1
                        throw new Error("The folder #{context} does not exists")
                    else
                        @_openFolder($root)
                        @_selectItem($root)
            return @

        ###
        # Expands all folders, applicable for only list/tree
        # @param instant [Boolean] If animations are instant
        # @returns [Object] this
        ###
        expandAll: (instant)->
            unless @settings.columnView
                self = @
                if instant
                    @settings._animationSpeed = @settings.animationSpeed
                    @settings.animationSpeed = 0
                $(@element).find('li.folder.is-collapsed > a').each((i,e)-> self.open(e))

                if instant
                    @settings.animationSpeed = @settings._animationSpeed
                    delete @settings._animationSpeed

            return @

        ###
        # Collapses all folders, applicable for only list/tree
        # @param instant [Boolean] If animations are instant
        # @returns [Object] this
        ###
        collapseAll: (instant)->
            unless @settings.columnView
                self = @
                if instant
                    @settings._animationSpeed = @settings.animationSpeed
                    @settings.animationSpeed = 0
                
                $(@element).find('li.folder.is-expanded > a').each((i,e)-> self.close(e))
                
                if instant
                    @settings.animationSpeed = @settings._animationSpeed
                    delete @settings._animationSpeed
                
            return @

        #Searches a given tree
        #FIXME
        search: (str)->

            str = str.toLowerCase()

            self = @

            $(@element).find('li').each( (index,item)->
                e = $(item)
                exists = self._data[index].indexOf(str) < 0
                if exists
                    if e.hasClass('folder') and e.find('> ul > li').length > 0
                        e.children('li').removeClass('is-hidden')
                    else
                        e.addClass('is-hidden')
                else
                    e.removeClass('is-hidden')
                return
            )

            @

        ###
        # Plugin destructor
        # @returns [Object] this
        ###
        destroy: ->
            $this.data("$.filetree", null) if $this.data("$.filetree")
            $(@element).off().empty()
            return @
        
        ###
        # Non Public Methods
        ###

        ###
        # Plugin Initializor
        ###
        _init: ->
            $root = $(@element).addClass('file-tree')

            #Temporarily detach element. Prevents excessive repaints.
            $temp = $(document.createElement('span')).insertAfter($(@element))
            $(@element).detach()
            
            #Create wrapper for column style
            if @settings.columnView
                $root.addClass('file-tree-columns')
                $root = $(document.createElement('div')).addClass('list-group-wrapper').appendTo($root)
            

            data = @settings.data
            self = @

            if @settings.ajax
                $.ajax( @settings.url, @settings.requestSettings)
                    .then((data) ->
                        data = self.settings.responseHandler(data)
                        self._createTree.call(self, $root, data)
                    )
            else if $.isArray(data) and data.length > 0
                @_createTree.call(@, $root, data)
            else
                @_parseTree.call(@, $root)

            @_addListeners()

            #Reattach element after processing
            $(@element).insertBefore($temp)
            $temp.remove()

            @._data = $.makeArray($root.find('li').map((k,v) -> $(v).text().toLowerCase()))
            
            data = null

            @element

        ###
        # Create tree from given data
        # @param elem [HTMLObject]
        # @param data [Array]
        ###
        _createTree: (elem, data)->
            $elem = $(elem)
            
            #Sort files and folders separately and combine them
            _files = []
            _folders = []

            for file in data
                if file.type is 'folder'
                    _folders.push(file)
                if file.type is 'file'
                    _files.push(file)

            _files.sort(@_nameSort)
            _folders.sort(@_nameSort)

            data = _folders.concat(_files)

            ul = $(document.createElement('ul')).addClass('list-group')
            
            #Loop over every item
            for item in data
                continue if item.type is 'file' and @settings.hideFiles is true
                
                li = $(document.createElement('li')).addClass("#{item.type} list-group-item")

                a = $(document.createElement('a')).attr('href' , '#')

                if ['file', 'folder'].indexOf(item.type) > -1
                    a.attr('title',item[@settings["#{item.type}NodeTitle"]])
                        .html(item[@settings["#{item.type}NodeName"]])
                else
                    a.attr('title',item.name).html(item.name)
                
                # Attach data to anchor
                for own key,value of item when key isnt 'children'
                    a.data(key, value)

                if @settings.columnView and item.type is 'folder'
                    arrow = $(document.createElement('span')).addClass("arrow #{@settings.classes.arrow}")
                    a.append(arrow)

                li.append(a)

                # Add checkbox if required
                if @settings.multiselect
                    checkbox = $(document.createElement('input')).attr('type','checkbox')
                    if not not item.readOnly
                        checkbox.prop('disabled', true)
                        li.addClass('is-read-only')
                    li.prepend(checkbox)

                # Folder specific tasks
                if item.type is 'folder'
                    li.addClass('is-collapsed')

                    if item.children is 'undefined' or item.children.length < 1
                        li.addClass('is-empty')

                    unless @settings.columnView
                        arrow = $(document.createElement('button')).addClass("arrow #{@settings.classes.arrow}")
                        li.prepend(arrow)

                    if @settings.hideFiles
                        _subfolders = $.grep(item.children, (e) -> e.type is 'folder')
                        if _subfolders.length > 0
                            li.removeClass('is-collapsed').addClass('is-empty')

                    # Recursive call on children
                    @_createTree.call(@,li,item.children) if $.isArray(item.children)

                li = @settings.nodeFormatter.call(null, li)
                ul.append(li)

            if @settings.columnView
                col = $(document.createElement('div')).addClass('columns')
                col.append(ul)
                $elem.append(col)
            else
                $elem.append(ul)

        ###
        # Opens a folder
        # @param elem [HTMLObject]
        ###
        _openFolder: (elem)->
            $a = elem.find('> a')
            $root= $(@element)
            $children = if @settings.columnView then elem.find('> .columns') else elem.find('> ul')
            that = @

            ev_start = $.Event('folder.open.filetree')
            ev_end= $.Event('folder.opened.filetree')

            $root.trigger(ev_start)

            if @settings.columnView
                wrapper = $root.find('.list-group-wrapper').eq(0)
                @_selectItem(elem)

                if $children.find('> ul > li').length > 0
                    $children.clone(true).appendTo(wrapper)
                else
                    wrapper.append("<div class=\"columns empty\"><p>empty folder</p></div>")
                $root.trigger(ev_end)
            else
                $children.slideDown(that.settings.animationSpeed, ->
                    elem.removeClass('is-collapsed').addClass('is-expanded')
                    $children.removeAttr('style')
                    $root.trigger(ev_end)
                )
            return

        ###
        # Closes a folder
        # @param elem [HTMLObject]
        ###
        _closeFolder: (elem)->
            $a = elem.find('> a')
            $children = if @settings.columnView then elem.closest('.columns') else elem.find('> ul')
            that = @
            $root= $(@element)
            
            ev_start = $.Event('folder.close.filetree')
            ev_end= $.Event('folder.closed.filetree')

            $root.trigger(ev_start)

            if @settings.columnView
                $children.nextAll('.columns').remove()
                $root.trigger(ev_end)
            else
                $children.slideUp(
                    that.settings.animationSpeed
                    ->
                        elem.removeClass('is-expanded').addClass('is-collapsed')
                        $children.removeAttr('style')
                        $root.trigger(ev_end)
                        return
                )
            return

        ###
        # Selects a given item, only visually
        # @param elem [HTMLObject]
        ###
        _selectItem: (elem) ->
            $parent = if @settings.columnView then elem.closest('.columns') else $(@element)
            
            $parent.find('li.active').removeClass('active') # Remove current active classes

            @_closeFolder(elem) if @settings.columnView # In column view, close successive columns
            
            elem.addClass('active') # Make current active

        ###
        # Factory for click events
        # @param events [Object] Event object
        ###
        _triggerClickEvent: (event)->
            
            $root = $(@element)
            self = this
            @_clicks++
            
            $a = $(event.target)
            
            item = if $a.closest('li').hasClass('folder') then 'folder' else 'file'
            data = $a.data()
            
            if @_clicks is 1
                @_timer = setTimeout(
                    ->
                        self._clicks = 0
                        $a.trigger("#{item}.click.filetree", data)
                        return
                    self.settings.dblclickDelay
                )
            else
                clearTimeout(@_timer)
                $a.trigger("#{item}.dblclick.filetree", data)
                @_clicks = 0
            
            event.preventDefault()
            return

        ###
        # Binds Listeners
        ###
        _addListeners: ->
            $root = $(@element)
            that = @

            $root.on('click','li.folder > a, li.file > a', @_triggerClickEvent.bind(@))

            unless @settings.columnView
                $root.on(
                    'click'
                    'li.folder.is-collapsed > button.arrow'
                    (event) ->
                        that._openFolder($(event.target).closest('li'))
                        event.stopImmediatePropagation()
                        return
                ).on(
                    'click'
                    'li.folder.is-expanded > button.arrow'
                    (event) ->
                        that._closeFolder($(event.target).closest('li'))
                        event.stopImmediatePropagation()
                        return
                )

            if @settings.multiselect and @settings.hierarchialCheck
                $root.on(
                    'change'
                    'input[type=checkbox]:not([disabled])'
                    (event)->
                        
                        $currentNode = $(event.target).closest('li')
                        
                        if $currentNode.hasClass('folder') and not $currentNode.hasClass('is-empty')
                            ischecked = $currentNode.find('> input[type=checkbox]:not([disabled])').prop('checked')
                            $currentNode
                                .find('> ul')
                                .find('input[type=checkbox]:not([disabled])')
                                .prop('checked', ischecked)
                                .prop('indeterminate', false)
                            
                        $currentNode.parentsUntil($root, 'li.folder').each(->
                            $parentNode = $(@)

                            childNodes = $parentNode.find('> ul').find('input[type=checkbox]:not([disabled])')
                            immediateChild = $parentNode.find('> input[type=checkbox]:not([disabled])')
                            checkedNodes = $parentNode.find('> ul').find('input[type=checkbox]:not([disabled]):checked')

                            if checkedNodes.length > 0
                                immediateChild.semicheck()

                                if checkedNodes.length is childNodes.length
                                    immediateChild.check()

                            else
                                immediateChild.uncheck()
                        )
                        
                        event.stopImmediatePropagation()
                        return
                )

            return

        #FIXME
        _parseTree: (elem)->
            $elem = $(elem)
            $temp = $(document.createElement('span')).insertAfter($elem)
            $elem.detach()

            files = $elem.find("> li")

            for file in files

                sublist = $(file).find("> ul")
                children = $(sublist).find("> li")
                
                if children.length > 0 or $(file).hasClass('folder')
                    arrow = $(document.createElement('button')).addClass('arrow')
                    $(file).addClass('folder has-children is-collapsed').prepend(arrow)
                    @_parseTree(item) for item in sublist
                else
                    $(file).addClass('file')

                if @settings.style is 'list' and @settings.multiselect is true
                    checkbox = $(document.createElement('input')).attr('type','checkbox')
                    $(file).prepend(checkbox)

            $elem.find('li > a[data-type=folder]').closest('li').addClass('folder').removeClass('file')

            $elem.insertBefore($temp)
            $temp.remove()

        ###
        # Helper for sort
        ###
        _nameSort: (a,b)->
            if a.name.toLowerCase() < b.name.toLowerCase()
                -1
            else if a.name.toLowerCase() > b.name.toLowerCase()
                1
            else
                0

    ###
    # PLUGIN DEFINITION
    ###
    Plugin = (options, obj) ->
        retVal = @
        @each(->
            $this = $(this)
            data = $this.data('$.filetree')
            
            unless data
                $this.data("$.filetree", (data = new FileTree(@, options)))

            if typeof options is 'string' and options.substr(0,1) isnt '_'
                retVal = data[options].call(data,obj)

            return
        )
        retVal

    old = $.fn.filetree

    $.fn.filetree = Plugin
    $.fn.filetree.Constructor = FileTree

    ###
    # NO CONFLICT
    ###
    $.fn.filetree.noConflict = ->
        $.fn.filetree = old
        @

    return
)
