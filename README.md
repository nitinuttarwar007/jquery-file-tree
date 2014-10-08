#jQuery-File-Tree
A highly customisable jQuery filetree plugin for displaying folder structures.

##Usage
```js
$(document).ready(function(){

    $('#example').filtree([options]);
    
});
```
##Options
| option          |  type    | default                        | descrpition                                                                                                                                                          |
|-----------------|----------|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data            | object   | []                             | The Data that is to be displayed                                                                                                                                     |
| animationSpeed  | integer  | 400                            | Duration of sliding animation in *milliseconds*                                                                                                                      |
| folderTrigger   | string   | click                          | Mouse event, on which a folder expansion must be triggered. Initial support for `click` and `dblclick` only                                                          |
| hideFiles       | boolean  | false                          | Hides files and displays only folders                                                                                                                                |
| multiselect     | boolean  | false                          | Enable checkboxes for selecting multiple files/folders                                                                                                               |
| fileNodeName    | string   | name                           | The key whose value is to be used for display text for files                                                                                                         |
| fileNodeTitle   | string   | name                           | The key whose value is to be used for title attribute in anchor link for files                                                                                       |
| folderNodeName  | string   | name                           | The key whose value is to be used for display text for folders                                                                                                       |
| folderNodeTitle | string   | name                           | The key whose value is to be used for title attribute in anchor link for folders                                                                                     |
| nodeFormatter   | function | function(node){ return node; } | A function that can be used to customize a node. This can be used to add extra classes depending on associated data<br> **Note: Remember to return the node at end** |
| ajax            | boolean  | false                          | Determines if data is to be fetched via AJAX                                                                                                                         |
| url             | string   | "./"                           | URL to be used for ajax call                                                                                                                                         |
| requestSettings | object   | {}                             | `$.ajax` [settings](http://api.jquery.com/jquery.ajax/) that are to be used while making the ajax call                                                               |
| responseHandler | function | function(data){ return data; } | A function that can be used to customize the ajax response data.<br> **Note: Remember to return data at end**                                                        |

 > Not all the options mentioned above are applicable on DOM source

 Only the following are applicable
  - animationSpeed
  - folderTrigger
  
##Data format
The following data formats are in order of precedence

###AJAX
The response must be a JSON object in a format shown below.

###JSON
- `name` and `type` keys required for all
- `ext` is optional. If provided, a class (with the value of the key) will be added to <code>li</code>. This can be used to customize the folder/file icons
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
> **Note**: Any extra information passed is bound on the respective anchor using <code>$('a').data(key,value)</code>. Hence, it can be retreived using <code>$(event.target).data(key)</code> on any of the events mentioned below.

###DOM
If you need to use an exisiting <code>ul</code> as a filtree, just call filetree method on it without specifying the data.
```html
<ul id="my-filetree">
    <li><a href="#">Folder A</a>
        <ul>
            <li><a href="#">Folder AA</a>
                <ul>
                    <li><a href="#">File 003</a></li>
                    <li><a href="#">File 004</a></li>
                </ul>
            </li>
            <li><a href="#">File 001</a></li>
            <li><a href="#">File 002</a></li>
        </ul>
    </li>
    <li><a href="#">Folder B</a>
        <ul>
            <li>
                <a href="#" data-type="folder">Folder B</a>
            </li>
            <li><a href="#">File 01</a></li>
            <li><a href="#">File 02</a></li>
        </ul>
    </li>
</ul>
```

```js
$('#my-filtree').filtree();
```

> Each li will be considered as a file unless it has a non-empty <code>ul</code> as its child or has an attribute of <code>data-type="folder"</code> on its anchor link.

##Events
| event                   | description                                        |
|-------------------------|----------------------------------------------------|        
| open.folder.filtree     | Fired when a folder is being opended/expanded      |
| opened.folder.filtree   | Fired when a folder is completely opended/expanded |
| close.folder.filtree    | Fired when a folder is being closed/collapsed      |
| closed.folder.filtree   | Fired when a folder is completely closed/collapsed |
| click.folder.filtree    | Fired when a folder is clicked                     |
| click.file.filtree      | Fired when a file is clicked                       |
| dblclick.folder.filtree | Fired when a folder is double-clicked              |
| dblclick.file.filtree   | Fired when a file is double-clicked                |


> Event handler takes two parameters: event and data

##Methods
Following methods can be used in conjunction to the events mentioned above

###open
Opens a folder
```js
$('#example').on('click.folder.filetree', function(e){
   $(this).filetree('open', e.target); 
});
```

###close
Closes a folder
```js
$('#example').on('click.folder.filetree', function(e){
   $(this).filetree('close', e.target); 
});
```

###toggle
Toggles a folder
```js
$('#example').on('click.folder.filetree', function(e){
   $(this).filetree('toggle', e.target); 
});
```

###select
Selects a file/folder
```js
$('#example').on('click.folder.filetree click.file.filetree', function(e){
   $(this).filetree('select', e.target);
});
```

###getSelected
Returns an array of selected elements where each element is a `jQuery Object`
requires **multiselect** to be `true`
```js
$('#example').filetree('getSelected')
```

###Search
Filter/Search the stucture
```js
$('#example').filetree('search', 'subject to be searched')
```


###destroy
Destroys the file tree.
```js
$('#example').filetree('destroy');
```

##Changelog
You can find change log [here](CHANGELOG.md)

##TODO
- Add more options to customize the search behaviour  