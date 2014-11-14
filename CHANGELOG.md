#Change Log

##v0.2.0
This version is a complete rewrite of the plugin.

##Added
####Options
- `columnView` - enables mac styled column view
- `dblclickDelay` - Interval (in milliseconds) within which double click must be registered
- `classes.arrow` - class to be applied to arrow

###Methods
- `getActivePath` - returns currently selected path
- `expandTo` - expands structure to given path
- `collapseAll` - collapses entire structure

###Changes
####Breaking
#####Changed options
- `multiselect` to `checkboxes`
- `hierarchy` to `hierarchialCheck`

#####Changed events
- `open.folder.filetree` to `folder.open.filtree`
- `opened.folder.filetree` to `folder.opened.filtree`
- `close.folder.filetree` to `folder.close.filtree` 
- `closed.folder.filetree` to `folder.closed.filtree`  
- `click.folder.filetree` to `folder.click.filtree` 
- `click.file.filetree` to `file.click.filtree`  
- `dblclick.folder.filetree` to `folder.dblclick.filtree`
- `dblclick.file.filetree` to `file.dblclick.filtree`

#####Renamed Classes
- `.is-selected` to `.active`

####Enhancements
- added `instant` parameter to `expandAll` method for instant collapse
- use [bootstrap](http://getbootstrap.com) themes

##v0.1.0

###Added
####options
- `folderNodeName` - key for value to be used as folder name
- `folderNodeTitle` - key for value to be used in title attribute for folder
- `responseHandler` - customize ajax response data
- `nodeFormatter` - customize the tree nodes
- `multiselect` - checkbox selections of file/folders
- `hierarchy` - hierarchiral selection of checkboxes

####Methods
- `getSelected`: retrives selected values if multiselect is enabled
- `search` method

###Changes
####Breaking
#####Renamed Classes
- `.collapsed` to `.is-collapsed`
- `.expanded` to `.is-expanded`
- `.hidden` to `.is-hidden`

#####Changed options
- `nodeName` to `fileNodeName`
- `nodeTitle` to `fileNodeTitle`
- `post` to `requestSettings`

###Fixed
- bug fix #2


##v0.0.2
###Added
- options to automatocally load data via AJAX

##v0.0.1
Initial Release
