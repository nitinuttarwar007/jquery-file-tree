
/*
 * Filtree plugin
 * @version 0.3.0
 * @author Vivek Kumar Bansal <contact@vkbansal.me>
 */
var __hasProp = {}.hasOwnProperty;

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
})(function($) {

  /*
   *  Utility functions
   */
  var FileTree, Plugin, defaults, old;
  $.fn.check = function() {
    return this.each(function() {
      return $(this).prop('indeterminate', false).prop('checked', true);
    });
  };
  $.fn.uncheck = function() {
    return this.each(function() {
      return $(this).prop('indeterminate', false).prop('checked', false);
    });
  };
  $.fn.semicheck = function() {
    return this.each(function() {
      return $(this).prop('indeterminate', true).prop('checked', false);
    });
  };
  $.fn.togglecheck = function() {
    return this.each(function() {
      var e;
      e = $(this);
      return e.prop('checked', !e.prop('checked'));
    });
  };

  /*
   * Default options
   * @option data             [Array]   The Data to be displayed
   * @option ajax             [Boolean] Determines if data is to be fetched via AJAX
   * @option url              [String]  URL to be used for AJAX call
   * @option requestSettings  [Object]  Ajax settings that are to be used while making the ajax call
   * @option animationSpeed   [Number]
   * @option hideFiles        [Boolean]
   * @option fileNodeName     [String]
   * @option folderNodeName   [String]
   * @option fileNodeTitle    [String]
   * @option folderNodeTitle  [String]
   * @option nodeFormatter    [Function]
   * @option columnView       [Boolean]
   * @option dblclickDelay    [Number]
   * @option classes.arrow    [String]
   * @option checkboxes       [Boolean]
   * @option hierarchialCheck [Boolean]
   */
  defaults = {
    data: [],
    ajax: false,
    url: "./",
    requestSettings: {},
    responseHandler: function(data) {
      return data;
    },
    animationSpeed: 400,
    hideFiles: false,
    fileNodeName: 'name',
    folderNodeName: 'name',
    fileNodeTitle: 'name',
    folderNodeTitle: 'name',
    nodeFormatter: function(node) {
      return node;
    },
    columnView: false,
    dblclickDelay: 200,
    classes: {
      arrow: "glyphicon glyphicon-chevron-right"
    },
    searchInput: null,
    checkboxes: false,
    hierarchialCheck: true
  };

  /*
   * FileTree Class Definition
   */
  FileTree = (function() {
    function FileTree(element, options) {
      var VERSION;
      this.element = element;
      VERSION = '0.3.0';
      this.settings = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._clicks = 0;
      this._timer = null;
      this.settings.checkboxes = this.settings.columnView ? false : void 0;
      this._init();
    }


    /*
     * Public Methods
     */


    /*
     * Opens a folder, applicable for both modes
     * @param elem [HTMLObject] folder to be opened
     * @return [Object] this
     */

    FileTree.prototype.open = function(elem) {
      var $parent;
      $parent = $(elem).closest('li');
      if (!$parent.hasClass('folder')) {
        return false;
      }
      this._openFolder($parent);
      return this;
    };


    /*
     * Closes a folder, applicable for both modes
     * @param elem [HTMLObject] folder to be opened
     * @return [Object] this
     */

    FileTree.prototype.close = function(elem) {
      var $parent;
      $parent = $(elem).closest('li');
      if (!$parent.hasClass('folder')) {
        return false;
      }
      this._closeFolder($parent);
      return this;
    };


    /*
     * Toggles a folder, applicable only for list/tree mode
     * @param elem [HTMLObject] folder to be toggled
     * @return [Object] this
     */

    FileTree.prototype.toggle = function(elem) {
      var $parent;
      if (!this.settings.columnView) {
        $parent = $(elem).closest('li');
        if ($parent.hasClass('is-collapsed')) {
          this._openFolder($parent);
        } else if ($parent.hasClass('is-expanded')) {
          this._closeFolder($parent);
        }
      }
      return this;
    };


    /*
     * Selects/Highlights given node
     * @param elem [HTMLObject] node to be highlighted
     * @return [Object] this
     */

    FileTree.prototype.select = function(elem) {
      this._selectItem($(elem).closest('li'));
      if (this.settings.checkboxes) {
        $(elem).siblings('input[type=checkbox]').togglecheck().change();
      }
      return this;
    };


    /*
     * Returns selected nodes, only if multiselect is true
     * @returns [Array, Boolean] Array if multiselect is set to true else false
     */

    FileTree.prototype.getSelectedNodes = function() {
      if (this.settings.checkboxes) {
        $(this.element).find('input[type=checkbox]:checked').map(function(i, e) {
          return $(e).siblings('a');
        }).get();
      }
      return false;
    };


    /*
     * Gives current selected path based on '.active'
     * @returns [String] Current active path
     */

    FileTree.prototype.getActivePath = function() {
      var parents;
      if (this.settings.columnView) {
        parents = $(this.element).find('.active');
      } else {
        parents = $(this.element).find('.active > a').parentsUntil(this.element, "li.folder");
      }
      parents = parents.map(function(i, e) {
        return $(e).find('> a').text();
      }).get();
      if (!this.settings.columnView) {
        parents.reverse();
      }
      return parents.join('/');
    };


    /*
     * Expands a folder to given path
     * @param path [String]
     * @throws Error if folder is not found
     * @returns [Object] this
     */

    FileTree.prototype.expandTo = function(path) {
      var $root, context, elem, index, _i, _j, _len, _len1;
      path = path.replace(/^\/|\/$/g, "").split('/');
      $root = $(this.element);
      if (this.settings.columnView) {
        $root = $root.find('> .list-group-wrapper');
        for (index = _i = 0, _len = path.length; _i < _len; index = ++_i) {
          context = path[index];
          elem = $root.find("> .columns").eq(index).find('> ul.list-group > li > a').filter(function() {
            return $(this).text() === context;
          });
          if (elem.length < 1) {
            throw new Error("The folder/file " + context + " does not exists");
          } else {
            this.open(elem);
            if (index === path.length - 1) {
              $(elem).click();
            }
          }
        }
      } else {
        this.collapseAll(true);
        for (index = _j = 0, _len1 = path.length; _j < _len1; index = ++_j) {
          context = path[index];
          $root = $root.find('> ul.list-group > li').filter(function() {
            return $(this).find('> a').text() === context;
          });
          if ($root.length < 1) {
            throw new Error("The folder/file " + context + " does not exists");
          } else {
            this._openFolder($root);
            this._selectItem($root);
            if (index === path.length - 1) {
              $root.find('> a').click();
            }
          }
        }
      }
      return this;
    };


    /*
     * Expands all folders, applicable for only list/tree
     * @param instant [Boolean] If animations are instant
     * @returns [Object] this
     */

    FileTree.prototype.expandAll = function(instant) {
      var self;
      if (!this.settings.columnView) {
        self = this;
        if (instant) {
          this.settings._animationSpeed = this.settings.animationSpeed;
          this.settings.animationSpeed = 0;
        }
        $(this.element).find('li.folder.is-collapsed > a').each(function(i, e) {
          return self.open(e);
        });
        if (instant) {
          this.settings.animationSpeed = this.settings._animationSpeed;
          delete this.settings._animationSpeed;
        }
      }
      return this;
    };


    /*
     * Collapses all folders
     * @param instant [Boolean] If animations are instant
     * @returns [Object] this
     */

    FileTree.prototype.collapseAll = function(instant) {
      var self;
      self = this;
      if (this.settings.columnView) {
        $(this.element).find('.columns:not(:first-child)').remove().end().find('.active').removeClass('active');
      } else {
        if (instant) {
          this.settings._animationSpeed = this.settings.animationSpeed;
          this.settings.animationSpeed = 0;
        }
        $(this.element).find('li.folder.is-expanded > a').each(function(i, e) {
          return self.close(e);
        });
        if (instant) {
          this.settings.animationSpeed = this.settings._animationSpeed;
          delete this.settings._animationSpeed;
        }
      }
      return this;
    };

    FileTree.prototype.search = function(str) {
      var self;
      str = str.toLowerCase();
      self = this;
      $(this.element).find('li').each(function(index, item) {
        var e, exists;
        e = $(item);
        exists = self._data[index].indexOf(str) < 0;
        if (exists) {
          if (e.hasClass('folder') && e.find('> ul > li').length > 0) {
            e.children('li').removeClass('is-hidden');
          } else {
            e.addClass('is-hidden');
          }
        } else {
          e.removeClass('is-hidden');
        }
      });
      return this;
    };


    /*
     * Plugin destructor
     * @returns [Object] this
     */

    FileTree.prototype.destroy = function() {
      $(this.element).data("$.filetree", null);
      $(this.element).off().empty();
      return this;
    };


    /*
     * Non Public Methods
     */


    /*
     * Plugin Initializor
     */

    FileTree.prototype._init = function() {
      var $root, $temp, data, self;
      $root = $(this.element).addClass('file-tree');
      $temp = $(document.createElement('span')).insertAfter($(this.element));
      $(this.element).detach();
      if (this.settings.columnView) {
        $root.addClass('file-tree-columns');
        $root = $(document.createElement('div')).addClass('list-group-wrapper').appendTo($root);
      }
      data = this.settings.data;
      self = this;
      if (this.settings.ajax) {
        $.ajax(this.settings.url, this.settings.requestSettings).then(function(data) {
          data = self.settings.responseHandler(data);
          return self._createTree.call(self, $root, data);
        });
      } else if ($.isArray(data) && data.length > 0) {
        this._createTree.call(this, $root, data);
      } else {
        this._parseTree.call(this, $root);
      }
      this._addListeners();
      $(this.element).insertBefore($temp);
      $temp.remove();
      this._data = $.makeArray($root.find('li').map(function(k, v) {
        return $(v).text().toLowerCase();
      }));
      data = null;
      return this.element;
    };


    /*
     * Create tree from given data
     * @param elem [HTMLObject]
     * @param data [Array]
     */

    FileTree.prototype._createTree = function(elem, data, path) {
      var $elem, a, arrow, checkbox, col, file, item, key, li, ul, value, _files, _folders, _i, _j, _len, _len1, _subfolders;
      if (path == null) {
        path = "/";
      }
      $elem = $(elem);
      _files = [];
      _folders = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        file = data[_i];
        if (file.type === 'folder') {
          _folders.push(file);
        }
        if (file.type === 'file') {
          _files.push(file);
        }
      }
      _files.sort(this._nameSort);
      _folders.sort(this._nameSort);
      data = _folders.concat(_files);
      ul = $(document.createElement('ul')).addClass('list-group');
      for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
        item = data[_j];
        if (item.type === 'file' && this.settings.hideFiles === true) {
          continue;
        }
        li = $(document.createElement('li')).addClass("" + item.type + " list-group-item");
        a = $(document.createElement('a')).attr('href', '#');
        if (['file', 'folder'].indexOf(item.type) > -1) {
          a.attr('title', item[this.settings["" + item.type + "NodeTitle"]]).html(item[this.settings["" + item.type + "NodeName"]]).data('__path', path + item[this.settings["" + item.type + "NodeName"]]);
        } else {
          a.attr('title', item.name).html(item.name).data('__path', path + item.name);
        }
        for (key in item) {
          if (!__hasProp.call(item, key)) continue;
          value = item[key];
          if (key !== 'children') {
            a.data(key, value);
          }
        }
        if (this.settings.columnView && item.type === 'folder') {
          arrow = $(document.createElement('span')).addClass("arrow " + this.settings.classes.arrow);
          a.append(arrow);
        }
        li.append(a);
        if (this.settings.multiselect) {
          checkbox = $(document.createElement('input')).attr('type', 'checkbox');
          if (!!item.readOnly) {
            checkbox.prop('disabled', true);
            li.addClass('is-read-only');
          }
          li.prepend(checkbox);
        }
        if (item.type === 'folder') {
          li.addClass('is-collapsed');
          if (item.children === 'undefined' || item.children.length < 1) {
            li.addClass('is-empty');
          }
          if (!this.settings.columnView) {
            arrow = $(document.createElement('button')).addClass("arrow " + this.settings.classes.arrow);
            li.prepend(arrow);
          }
          if (this.settings.hideFiles) {
            _subfolders = $.grep(item.children, function(e) {
              return e.type === 'folder';
            });
            if (_subfolders.length > 0) {
              li.removeClass('is-collapsed').addClass('is-empty');
            }
          }
          if ($.isArray(item.children)) {
            this._createTree.call(this, li, item.children, a.data('__path') + "/");
          }
        }
        li = this.settings.nodeFormatter.call(null, li);
        ul.append(li);
      }
      if (this.settings.columnView) {
        col = $(document.createElement('div')).addClass('columns');
        col.append(ul);
        return $elem.append(col);
      } else {
        return $elem.append(ul);
      }
    };


    /*
     * Opens a folder
     * @param elem [HTMLObject]
     */

    FileTree.prototype._openFolder = function(elem) {
      var $a, $children, $parent, $root, clone, ev_end, ev_start, left, that, wrapper;
      $a = elem.find('> a');
      $root = $(this.element);
      $children = this.settings.columnView ? elem.find('> .columns') : elem.find('> ul');
      that = this;
      ev_start = $.Event('folder.open.filetree');
      ev_end = $.Event('folder.opened.filetree');
      $root.trigger(ev_start);
      if (this.settings.columnView) {
        wrapper = $root.find('.list-group-wrapper').eq(0);
        $parent = elem.closest('.columns');
        left = $parent.position().left + $parent.outerWidth() + wrapper.scrollLeft();
        this._selectItem(elem);
        if ($children.find('> ul > li').length > 0) {
          clone = $children.clone(true);
          clone.find('> ul').data('_parent', $a);
          clone.css('left', "" + left + "px");
          clone.appendTo(wrapper);
        } else {
          wrapper.append("<div class=\"columns empty\" style=\"left: " + left + "px\"><p>empty folder</p></div>");
        }
        wrapper.scrollLeft(left);
        $root.trigger(ev_end);
      } else {
        $children.slideDown(that.settings.animationSpeed, function() {
          elem.removeClass('is-collapsed').addClass('is-expanded');
          $children.removeAttr('style');
          return $root.trigger(ev_end);
        });
      }
    };


    /*
     * Closes a folder
     * @param elem [HTMLObject]
     */

    FileTree.prototype._closeFolder = function(elem) {
      var $a, $children, $root, ev_end, ev_start, that;
      $a = elem.find('> a');
      $children = this.settings.columnView ? elem.closest('.columns') : elem.find('> ul');
      that = this;
      $root = $(this.element);
      ev_start = $.Event('folder.close.filetree');
      ev_end = $.Event('folder.closed.filetree');
      $root.trigger(ev_start);
      if (this.settings.columnView) {
        $children.nextAll('.columns').remove();
        $root.trigger(ev_end);
      } else {
        $children.slideUp(that.settings.animationSpeed, function() {
          elem.removeClass('is-expanded').addClass('is-collapsed');
          $children.removeAttr('style');
          $root.trigger(ev_end);
        });
      }
    };


    /*
     * Selects a given item, only visually
     * @param elem [HTMLObject]
     */

    FileTree.prototype._selectItem = function(elem) {
      var $parent;
      $parent = this.settings.columnView ? elem.closest('.columns') : $(this.element);
      $parent.find('li.active').removeClass('active');
      if (this.settings.columnView) {
        this._closeFolder(elem);
      }
      return elem.addClass('active');
    };


    /*
     * Factory for click events
     * @param events [Object] Event object
     */

    FileTree.prototype._triggerClickEvent = function(event) {
      var $a, $root, data, item, self;
      $root = $(this.element);
      self = this;
      this._clicks++;
      $a = $(event.target);
      item = $a.closest('li').hasClass('folder') ? 'folder' : 'file';
      data = $a.data();
      if (this._clicks === 1) {
        this._timer = setTimeout(function() {
          self._clicks = 0;
          $a.trigger("" + item + ".click.filetree", data);
        }, self.settings.dblclickDelay);
      } else {
        clearTimeout(this._timer);
        $a.trigger("" + item + ".dblclick.filetree", data);
        this._clicks = 0;
      }
      event.preventDefault();
    };


    /*
     * Binds Listeners
     */

    FileTree.prototype._addListeners = function() {
      var $root, that;
      $root = $(this.element);
      that = this;
      $root.on('click', 'li.folder > a, li.file > a', this._triggerClickEvent.bind(this));
      if (!this.settings.columnView) {
        $root.on('click', 'li.folder.is-collapsed > button.arrow', function(event) {
          that._openFolder($(event.target).closest('li'));
          event.stopImmediatePropagation();
        }).on('click', 'li.folder.is-expanded > button.arrow', function(event) {
          that._closeFolder($(event.target).closest('li'));
          event.stopImmediatePropagation();
        });
      }
      if (this.settings.multiselect && this.settings.hierarchialCheck) {
        $root.on('change', 'input[type=checkbox]:not([disabled])', function(event) {
          var $currentNode, ischecked;
          $currentNode = $(event.target).closest('li');
          if ($currentNode.hasClass('folder') && !$currentNode.hasClass('is-empty')) {
            ischecked = $currentNode.find('> input[type=checkbox]:not([disabled])').prop('checked');
            $currentNode.find('> ul').find('input[type=checkbox]:not([disabled])').prop('checked', ischecked).prop('indeterminate', false);
          }
          $currentNode.parentsUntil($root, 'li.folder').each(function() {
            var $parentNode, checkedNodes, childNodes, immediateChild;
            $parentNode = $(this);
            childNodes = $parentNode.find('> ul').find('input[type=checkbox]:not([disabled])');
            immediateChild = $parentNode.find('> input[type=checkbox]:not([disabled])');
            checkedNodes = $parentNode.find('> ul').find('input[type=checkbox]:not([disabled]):checked');
            if (checkedNodes.length > 0) {
              immediateChild.semicheck();
              if (checkedNodes.length === childNodes.length) {
                return immediateChild.check();
              }
            } else {
              return immediateChild.uncheck();
            }
          });
          event.stopImmediatePropagation();
        });
      }
    };

    FileTree.prototype._parseTree = function(elem) {
      var $elem, $temp, arrow, checkbox, children, file, files, item, sublist, _i, _j, _len, _len1;
      $elem = $(elem);
      $temp = $(document.createElement('span')).insertAfter($elem);
      $elem.detach();
      files = $elem.find("> li");
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        sublist = $(file).find("> ul");
        children = $(sublist).find("> li");
        if (children.length > 0 || $(file).hasClass('folder')) {
          arrow = $(document.createElement('button')).addClass('arrow');
          $(file).addClass('folder has-children is-collapsed').prepend(arrow);
          for (_j = 0, _len1 = sublist.length; _j < _len1; _j++) {
            item = sublist[_j];
            this._parseTree(item);
          }
        } else {
          $(file).addClass('file');
        }
        if (this.settings.style === 'list' && this.settings.multiselect === true) {
          checkbox = $(document.createElement('input')).attr('type', 'checkbox');
          $(file).prepend(checkbox);
        }
      }
      $elem.find('li > a[data-type=folder]').closest('li').addClass('folder').removeClass('file');
      $elem.insertBefore($temp);
      return $temp.remove();
    };


    /*
     * Helper for sort
     */

    FileTree.prototype._nameSort = function(a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    };

    return FileTree;

  })();

  /*
   * PLUGIN DEFINITION
   */
  Plugin = function(options, obj) {
    var retVal;
    retVal = this;
    this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data('$.filetree');
      if (!data) {
        $this.data("$.filetree", (data = new FileTree(this, options)));
      }
      if (typeof options === 'string' && options.substr(0, 1) !== '_') {
        retVal = data[options].call(data, obj);
      }
    });
    return retVal;
  };
  old = $.fn.filetree;
  $.fn.filetree = Plugin;
  $.fn.filetree.Constructor = FileTree;

  /*
   * NO CONFLICT
   */
  $.fn.filetree.noConflict = function() {
    $.fn.filetree = old;
    return this;
  };
});
