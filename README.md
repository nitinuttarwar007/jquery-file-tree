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
            <td>nodeName</td>
            <td>string</td>
            <td>'name'</td>
            <td>The key whose value is to be used for display text</td>
        </tr>
        <tr>
            <td>nodeTitle</td>
            <td>string</td>
            <td>'name'</td>
            <td>The key whose value is to be used for title attribute in anchor link</td>
        </tr>
    </tbody>
</table>

##Data format

###JSON
- <code>name</code> and <code>type</code> keys required for all
- <code>ext</code> is optional. If provided, a class (with the value of the key) will be added to <code>li</code>. This can be used to customize the folder/file icons
- <code>children</code> must be provided only for folders
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
selects a file/folder
```js
$('#example').on('click.folder.filetree click.file.filetree', function(e){
   $(this).filetree('select', e.target);
});
```

###destroy
Destroys the file tree.
```js
$('#example').filetree('destroy');
```

##Changelog
You can find change log [here](CHANGELOG.md)

##TODO
- Add <code>url</code> option for dynamic AJAX loading
- Add options to cutomize AJAX loading (dynamic) 
- Add <code>append</code> method for manual AJAX loading