do ($ = jQuery, window, document) ->

	# Create the defaults once
	defaults =
		data: []
		animationSpeed : 400
		folderTrigger: "click"
		hideFiles: false
		fileContainer: null
		nodeName: 'name'
		nodeTitle: 'name'

	###
		FILETREE CLASS DEFINITION
	###
	class FileTree
		constructor: (@element, options) ->
			@settings = $.extend {}, defaults, options
			@_defaults = defaults
			@init()

		init: ->
			data = JSON.parse(@settings.data)
			@_createTree.call(@, @element, data)
			$(@element).addClass('filetree')
			@_addListeners()
			return

		_createTree: (elem, data)->

			$elem = $(elem)
			
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

			if $elem.prop('tagName').toLowerCase() is 'ul'
			 	ul = $elem
			else
				ul = $(document.createElement('ul'))

			for item in data
				li = $(document.createElement('li'))
					.addClass(item.type)

				if item.type is 'file' and @settings.hideFiles is true
					li.addClass('hidden')

				a = $(document.createElement('a'))
					.attr('href' , '#')
					.attr('title',item[@settings.nodeTitle])
					.html(item[@settings.nodeName])

				for key,value of item
					if item.hasOwnProperty(key) and key isnt 'children'
						a.data(key, value)

				li.append(a)
				ul.append(li)
	
				if item.type is 'folder' and typeof item.children isnt 'undefined' and item.children.length > 0

					li.addClass('collapsed').addClass('has-children')

					arrow = $(document.createElement('button')).addClass('arrow')

					li.prepend(arrow)

					if @settings.hideFiles is true
						_subfolders = $.grep(
										item.children
										(e) ->
											e.type is 'folder'
									)
						if _subfolders.length > 0
							li.removeClass('collapsed').removeClass('has-children')
							li.find('button').removeClass('arrow').addClass('no-arrow')

					@_createTree.call(@,li,item.children)
				
			$elem.append(ul)

			return

		_openFolder: (elem)->
			$root = $(@element)
			$elem = $(elem)
			that = @

			ev_start = $.Event('open.folder.filetree')
			ev_end= $.Event('opened.folder.filetree')

			ul = $elem.find('ul').eq(0)
			$root.trigger(ev_start,$elem)

			ul.slideDown(
				that.settings.animationSpeed
				->
					$elem.removeClass('collapsed').addClass('expanded')
					ul.removeAttr('style')
					$root.trigger(ev_end,$elem)
					return
			)

			false

		_closeFolder: (elem)->
			$root = $(@element)
			$elem = $(elem)
			that = @

			ev_start = $.Event 'close.folder.filetree'
			ev_end= $.Event 'closed.folder.filetree'

			ul = $elem.find('ul').eq(0)
			$root.trigger(ev_start,$elem)

			ul.slideUp(
				that.settings.animationSpeed
				->
					$elem.removeClass('expanded').addClass('collapsed')
					ul.removeAttr('style')
					$root.trigger(ev_end,$elem)
					return
			)

			false

		_clickFolder: (elem)->
			$root = $(@element)
			$elem = $(elem)

			ev = $.Event 'click.folder.filtree'
			#console.log 'folder clicked'
			
			$root.trigger ev, $elem
			false

		_clickFile: (elem)->
			$root = $(@element)
			$elem = $(elem)
			#console.log 'file clicked'
			ev = $.Event 'click.file.filtree'

			$root.trigger ev, $root
			false

		_addListeners: ->
			$root = $(@element)
			that = @
			
			$root.on(
				'click'
				'li.folder.collapsed.has-children > button.arrow'
				(event) ->
					that._openFolder($(@).parent('li'))
			)

			$root.on(
				'click'
				'li.folder.expanded.has-children > button.arrow'
				(event) ->
					that._closeFolder($(@).parent('li'))
			)

			$root.on(
				'click'
				'li.folder > a'
				(event) ->
					that._clickFolder($(@).parent('li'))
					event.preventDefault()
					event.stopPropagation()
					#false
			)

			$root.on(
				'click'
				'li.file > a'
				(event) ->
					that._clickFile($(@).parent('li'))
					event.preventDefault()
					#false
			)
			return

		_nameSort:(a,b)->
			if a.name.toLowerCase() < b.name.toLowerCase()
				-1
			else if a.name.toLowerCase() > b.name.toLowerCase()
				1
			else
				0 

	###
		PLUGIN DEFINITION
	###
	Plugin = (options) ->
		@each ->
			$this = $(this)
			data = $this.data('$.filetree')
			
			unless data
				$this.data "$.filetree", new FileTree @, options

			if typeof options is 'string'
				data[options].call($this)

	old = $.fn.filetree

	$.fn.filetree = Plugin
	$.fn.filetree.Constructor = FileTree

	###
		NO CONFLICT
	###
	$.fn.filetree.noConflict = ->
		$.fn.filetree = old
		@

	return