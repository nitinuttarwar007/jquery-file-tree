(function($, window, document) {
  var FileTree, Plugin, defaults, old;
  defaults = {
    data: [],
    animationSpeed: 400,
    folderTrigger: "click",
    hideFiles: false,
    fileContainer: null,
    nodeName: 'name',
    nodeTitle: 'name'
  };

  /*
  		FILETREE CLASS DEFINITION
   */
  FileTree = (function() {
    function FileTree(element, options) {
      this.element = element;
      this.settings = $.extend({}, defaults, options);
      this._defaults = defaults;
      this.init();
    }

    FileTree.prototype.init = function() {
      var $root, data;
      $root = $(this.element);
      data = this.settings.data;
      if ($.isArray(data) && data.length > 0) {
        if ($root.prop('tagName').toLowerCase() === 'ul') {
          $root.addClass('filetree');
        } else {
          $root = $(document.createElement('ul')).addClass('filetree').appendTo($root);
        }
        this._createTree.call(this, $root, data);
      } else {
        if ($root.prop('tagName').toLowerCase() === 'ul') {
          $root.addClass('filetree');
        } else {
          $root = $root.find('ul').eq(0).addClass('filetree');
        }
        this._parseTree.call(this, $root);
      }
      this._addListeners();
      return $root;
    };

    FileTree.prototype.open = function(elem) {
      return this._openFolder(elem);
    };

    FileTree.prototype.close = function(elem) {
      return this._closeFolder(elem);
    };

    FileTree.prototype.toggle = function(elem) {
      var $parent;
      $parent = $(elem).closest('li');
      if ($parent.hasClass('collapsed')) {
        return this._openFolder(elem);
      } else if ($parent.hasClass('expanded')) {
        return this._closeFolder(elem);
      }
    };

    FileTree.prototype._createTree = function(elem, data) {
      var $elem, a, arrow, file, item, key, li, ul, value, _files, _folders, _i, _j, _len, _len1, _subfolders;
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
      if ($elem.prop('tagName').toLowerCase() === 'ul') {
        ul = $elem;
      } else {
        ul = $(document.createElement('ul'));
      }
      for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
        item = data[_j];
        li = $(document.createElement('li')).addClass(item.type);
        if (item.type === 'file' && this.settings.hideFiles === true) {
          li.addClass('hidden');
        }
        a = $(document.createElement('a')).attr('href', '#').attr('title', item[this.settings.nodeTitle]).html(item[this.settings.nodeName]);
        for (key in item) {
          value = item[key];
          if (item.hasOwnProperty(key) && key !== 'children') {
            a.data(key, value);
          }
        }
        li.append(a);
        ul.append(li);
        if (item.type === 'folder' && typeof item.children !== 'undefined' && item.children.length > 0) {
          li.addClass('collapsed').addClass('has-children');
          arrow = $(document.createElement('button')).addClass('arrow');
          li.prepend(arrow);
          if (this.settings.hideFiles === true) {
            _subfolders = $.grep(item.children, function(e) {
              return e.type === 'folder';
            });
            if (_subfolders.length > 0) {
              li.removeClass('collapsed').removeClass('has-children');
              li.find('button').removeClass('arrow').addClass('no-arrow');
            }
          }
          this._createTree.call(this, li, item.children);
        }
      }
      return $elem.append(ul);
    };

    FileTree.prototype._openFolder = function(elem) {
      var $a, $parent, $ul, ev_end, ev_start, that;
      $parent = $(elem).closest('li');
      if (!$parent.hasClass('folder')) {
        return false;
      }
      $a = $parent.find('a').eq(0);
      $ul = $parent.find('ul').eq(0);
      that = this;
      ev_start = $.Event('open.folder.filetree');
      ev_end = $.Event('opened.folder.filetree');
      $a.trigger(ev_start);
      $ul.slideDown(that.settings.animationSpeed, function() {
        $parent.removeClass('collapsed').addClass('expanded');
        $ul.removeAttr('style');
        return $a.trigger(ev_end);
      });
      return false;
    };

    FileTree.prototype._closeFolder = function(elem) {
      var $a, $parent, $ul, ev_end, ev_start, that;
      $parent = $(elem).closest('li');
      if (!$parent.hasClass('folder')) {
        return false;
      }
      $a = $parent.find('a').eq(0);
      $ul = $parent.find('ul').eq(0);
      that = this;
      ev_start = $.Event('close.folder.filetree');
      ev_end = $.Event('closed.folder.filetree');
      $a.trigger(ev_start);
      $ul.slideUp(that.settings.animationSpeed, function() {
        $parent.removeClass('expanded').addClass('collapsed');
        $ul.removeAttr('style');
        return $a.trigger(ev_end);
      });
      return false;
    };

    FileTree.prototype._clickFolder = function(elem) {
      var $a, $parent, ev;
      $a = $(elem);
      $parent = $a.closest('li');
      ev = $.Event('click.folder.filetree', {
        bubbles: false
      });
      $a.trigger(ev);
      return false;
    };

    FileTree.prototype._clickFile = function(elem) {
      var $a, $parent, ev;
      $a = $(elem);
      $parent = $a.closest('li');
      ev = $.Event('click.file.filetree', {
        bubbles: false
      });
      $a.trigger(ev);
      return false;
    };

    FileTree.prototype._addListeners = function() {
      var $root, that;
      $root = $(this.element);
      that = this;
      $root.on('click', 'li.folder.collapsed.has-children > button.arrow', function(event) {
        return that._openFolder(this);
      });
      $root.on('click', 'li.folder.expanded.has-children > button.arrow', function(event) {
        return that._closeFolder(this);
      });
      $root.on('click', 'li.folder > a', function(event) {
        return that._clickFolder(this);
      });
      $root.on('click', 'li.file > a', function(event) {
        return that._clickFile(this);
      });
      $root.on('click', 'li.folder, li.file', function(event) {
        return false;
      });
    };

    FileTree.prototype._parseTree = function(elem) {};

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
  		PLUGIN DEFINITION
   */
  Plugin = function(options, obj) {
    return this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data('$.filetree');
      if (!data) {
        $this.data("$.filetree", (data = new FileTree(this, options)));
      }
      if (typeof options === 'string') {
        return data[options].call(data, obj);
      }
    });
  };
  old = $.fn.filetree;
  $.fn.filetree = Plugin;
  $.fn.filetree.Constructor = FileTree;

  /*
  		NO CONFLICT
   */
  $.fn.filetree.noConflict = function() {
    $.fn.filetree = old;
    return this;
  };
})(jQuery, window, document);
