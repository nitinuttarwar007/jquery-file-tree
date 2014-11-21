#jQuery-File-Tree
A highly customisable jQuery filetree plugin for displaying folder structures.

> Warning: This plugin is still in development and API may keep changing. **Do not use this in production**. If you want to use it, you are free to do it *at your own risk*. 

##Installation
**Via Bower**
```
bower install jquery-filetree
```
**Manual**

Download [zip](https://github.com/vkbansal/jquery-file-tree/archive/master.zip)
##Usage
```markup
<link rel="stylesheet" href="path/to/filetree.css">
<script src="path/to/jquery.min.js"></script>
<script src="path/to/jquery.filetree.min"></script>
```
```js
$(document).ready(function(){

    $('#example').filtree(options);
    
});
```
##Options
**options.data**

Type: *Array*

The Data to be displayed

**options.ajax**

Type: *Boolean*

Default: `false`

Determines if data is to be fetched via AJAX

**options.url**

Type: *String*

Default: `"./"`

URL to be used for ajax call

**options.requestSettings**

Type: *Object*

Default: `{}`

`$.ajax` [settings](http://api.jquery.com/jquery.ajax/) that are to be used while making the ajax call

**options.responseHandler**

Type: *Function*

Default:
```js
function(data){
    return data;
}
```
A function that can be used to customize the ajax response data.<br> **Note: Remember to return data at end**

**options.animationSpeed**

Type: *Number* 

Default: `400`

Duration of sliding animation in *milliseconds*                                                                                                                      |
**options.hideFiles**

Type: *Boolean*  

Default: `false`

Hides files and displays only folders

**options.fileNodeName**

Type: *String*

Default: `'name'`

The key whose value is to be used for display text for files

**options.folderNodeName**

Type: *String*

Default: `'name'`

The key whose value is to be used for display text for folders

**options.fileNodeTitle**

Type: *String*

Default: `'name'`

The key whose value is to be used for title attribute in anchor link for files

**options.folderNodeTitle**

Type: *String*

Default: `'name'`

The key whose value is to be used for title attribute in anchor link for folders

**options.nodeFormatter**

Type: *Function*

Default: 
```js
function(node){
    return node;
}
```
A function that can be used to customize a node. This can be used to add extra classes depending on associated data<br> **Note: Remember to return the node at end**

**options.columnView**

Type: *Boolean*

Default: `false`

If true, uses mac like columns view

**options.dblclickDelay**

Type: *Number*

Default: `300`

Interval (in milliseconds) within which double click must be registered

**options.classes.arrow**

Type: *String*

Default: `"glyphicon glyphicon-chevron-right"`

The class to be used by arrow

**options.checkboxes**

Type: *Boolean*

Default: `false`

Enable checkboxes for selecting multiple files/folders. Only applicable in list/tree mode.

**options.hierarchialCheck**

Type: *Boolean*

Default: `true`

Enable hierarchial selection of checkboxes. Requires **multiselect** to be `true`

> Not all the options mentioned above are applicable on DOM source

##Data format
The following data formats are in order of precedence

###AJAX
The response must be a JSON object in a format shown below.

###JSON
- `name` and `type` keys required for all
- `ext` is optional. If provided, a class (with the value of the key) will be added to `li`. This can be used to customize the folder/file icons
- `children` must be provided only for folders
- `readOnly` can be provided as a boolean for disabling select/checkbox on particular folder/file (applicable only when `mutliselect` is `true`)
```js
[
    {
        "name": "A",
        "type": "folder",
        "children": [
            {
                "name": "001",
                "ext" : "txt",
                "type": "file"
            },{
                "name": "002",
                "ext" : "txt",
                "type": "file"
            },{
                "name": "AA",
                "type": "folder",
                "children": [
                    {
                        "name": "003",
                        "ext" : "txt",
                        "type": "file"
                    },{
                        "name": "004",
                        "ext" : "txt",
                        "type": "file"
                    }
                ]
            }
        ]
    }, {
        "name": "B",
        "type": "folder",
        "children": [
            {
                "name": "01",
                "ext": "jpg",
                "type": "file"
            },{
                "name": "02",
                "ext": "jpg",
                "type": "file"
            },{
                "name": "B",
                "type": "folder",
                "children": []
            }
        ]    
    }
]
```
> **Note**: Any extra information passed is bound on the respective anchor using `$('a').data(key,value)`. Hence, it can be retreived using `$(event.target).data(key)` on any of the events mentioned below.

##Events
| event                   | fired when                              |
|-------------------------|-----------------------------------------|        
| folder.open.filtree     | A folder is being opended/expanded      |
| folder.opened.filtree   | A folder is completely opended/expanded |
| folder.close.filtree    | A folder is being closed/collapsed      |
| folder.closed.filtree   | A folder is completely closed/collapsed |
| folder.click.filtree    | A folder is clicked                     |
| file.click.filtree      | A file is clicked                       |
| folder.dblclick.filtree | A folder is double-clicked              |
| file.dblclick.filtree   | A file is double-clicked                |


> Event handler takes two parameters: event and data

##Methods
Following methods can be used in along the events mentioned above

###open
Opens a folder
```js
$('#example').on('folder.click.filetree', function(e){
   $(this).filetree('open', e.target); 
});
```

###close
Closes a folder
```js
$('#example').on('folder.click.filetree', function(e){
   $(this).filetree('close', e.target); 
});
```

###toggle
Toggles a folder. Applicable only in list view.
```js
$('#example').on('folder.click.filetree', function(e){
   $(this).filetree('toggle', e.target); 
});
```

###select
Selects a file/folder. It applies `.active` to parent `li`.
```js
$('#example').on('folder.click.filetree file.click.filetree', function(e){
   $(this).filetree('select', e.target);
});
```

###getSelected
Returns an array of selected elements where each element is a `HTMLObject`. Requires **multiselect** to be `true`. Applicable only in list view.
```js
$('#example').filetree('getSelected');
```
###getActivePath
Gives current active path based on `.active`.
```js
$('#example').filetree('getActivePath');
```

###expandTo
Expands structure to given path. Throws an `error` if given path is invalid.
```js
$('#example').filetree('expandTo', 'path/to/expand');
```

###expandAll
Expands entire structure. Applicable only in list view.
```js
$('#example').filetree('expandAll');
```

###collapseAll
Expands entire structure. Applicable only in list view.
```js
$('#example').filetree('collapseAll');
```

###search
Filter/Search the stucture. **experimental**
```js
$('#example').filetree('search', 'subject to be searched');
```

###destroy
Destroys the file tree.
```js
$('#example').filetree('destroy');
```

##Changelog
You can find change log [here](CHANGELOG.md)
