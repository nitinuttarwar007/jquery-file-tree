#jQuery-File-Tree
A highly customisable jQuery filetree plugin for displaying folder structures.

##Usage
<pre><code>$(document).ready(function(){

    $('#example').filtree([options]);
    
});
</code></pre>
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
            <td>fileContainer</td>
            <td>string</td>
            <td>null</td>
            <td>jQuery Selector of the div where the files of selected folder are to be shown. Only applicable when <code>hideFiles</code> is set to <code>true</code>.</td>
        </tr>
    </tbody>
</table>

##Data format
The data required is in recursive format with <code>name</code>, <code>type</code> and <code>children</code> keys required for <em>folder</em> type and <code>name</code>, <code>type</code> and <code>ext</code> keys required for <em>file</em> type.
<pre><code>
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
        "type": "folder"
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
                "type": "folder"
                "children": []
            }
        ]    
    }
]
</code></pre>
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
    </tbody>
</table>
File and folder <code>click</code> events can be handled via native jQuery methods