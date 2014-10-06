#jQuery-File-Tree
A highly customisable jQuery filetree plugin for displaying folder structures.

##Usage
```js
$(document).ready(function(){

    $('#example').filtree([options]);
    
});
```
##Options
<table>
    <thead>
        <tr>
            <th>option</th>
            <th>type</th>
            <th>default</th>
            <th>description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>data</td>
            <td>object</td>
            <td>[ ]</td>
            <td>The Data that is to be displayed</td>
        </tr>
        <tr>
            <td>animationSpeed</td>
            <td>integer</td>
            <td>400</td>
            <td>Duration of sliding animation in <em>milliseconds</em></td>
        </tr>
        <tr>
            <td>folderTrigger</td>
            <td>string</td>
            <td>click</td>
            <td>Mouse event, on which a folder expansion must be triggered. Initial support for <code>click</code> and <code>dblclick</code> only</td>
        </tr>
        <tr>
            <td>hideFiles</td>
            <td>boolean</td>
            <td>false</td>
            <td>Hides files and displays only folders</td>
        </tr>
        <tr>
            <td>multiselect</td>
            <td>boolean</td>
            <td>false</td>
            <td>Enable checkboxes for selecting multiple files/folders</td>
        </tr>
        <tr>
            <td>fileNodeName</td>
            <td>string</td>
            <td>'name'</td>
            <td>The key whose value is to be used for display text for files</td>
        </tr>
        <tr>
            <td>fileNodeTitle</td>
            <td>string</td>
            <td>'name'</td>
            <td>The key whose value is to be used for title attribute in anchor link for files</td>
        </tr>
        <tr>
            <td>folderNodeName</td>
            <td>string</td>
            <td>'name'</td>
            <td>The key whose value is to be used for display text for folders</td>
        </tr>
        <tr>
            <td>folderNodeTitle</td>
            <td>string</td>
            <td>'name'</td>
            <td>The key whose value is to be used for title attribute in anchor link for folders</td>
        </tr>
        <tr>
            <td>nodeFormatter</td>
            <td>function</td>
            <td>function(node){ return node; }</td>
            <td>A function that can be used to customize a node. This can be used to add extra classes depending on associated data<b>Note: Remember to return the node at end</b></td>
        </tr>
        <tr>
            <td>ajax</td>
            <td>boolean</td>
            <td>false</td>
            <td>Determines if data is to be fetched via AJAX</td>
        </tr>
        <tr>
            <td>url</td>
            <td>string</td>
            <td>"./"</td>
            <td>URL to be used for ajax call</td>
        </tr>
        <tr>
            <td>requestSettings</td>
            <td>object</td>
            <td>{}</td>
            <td><code>$.ajax</code> <a href="http://api.jquery.com/jquery.ajax/">settings</a> that are to be used while making the ajax call</td>
        </tr>
        <tr>
            <td>responseHandler</td>
            <td>function</td>
            <td>function(data){ return data; }</td>
            <td>A function that can be used to customize the ajax response data. <b>Note: Remember to return data at end</b></td>
        </tr>

    </tbody>
</table>

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
<table>
    <thead>
        <tr>
            <th>event</th>
            <th>description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>open.folder.filtree</td>
            <td>Fired when a folder is being opended/expanded</td>
        </tr>
        <tr>
            <td>opened.folder.filtree</td>
            <td>Fired when a folder is completely opended/expanded</td>
        </tr>
        <tr>
            <td>close.folder.filtree</td>
            <td>Fired when a folder is being closed/collapsed</td>
        </tr>
        <tr>
            <td>closed.folder.filtree</td>
            <td>Fired when a folder is completely closed/collapsed</td>
        </tr>
        <tr>
            <td>click.folder.filtree</td>
            <td>Fired when a folder is clicked</td>
        </tr>
        <tr>
            <td>click.file.filtree</td>
            <td>Fired when a file is clicked</td>
        </tr>
        <tr>
            <td>dblclick.folder.filtree</td>
            <td>Fired when a folder is double-clicked</td>
        </tr>
        <tr>
            <td>dblclick.file.filtree</td>
            <td>Fired when a file is double-clicked</td>
        </tr>
    </tbody>
</table>

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