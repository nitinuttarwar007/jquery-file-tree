#Change Log

##master

###breaking changes
- Renamed Classes
  - `.collapsed` to `.is-collapsed`
  - `.expanded` to `.is-expanded`
  - `.hidden` to `.is-hidden`
- Changed options
  - `nodeName` to `fileNodeName`
  - `nodeTitle` to `fileNodeTitle`
  - `post` to `requestSettings`

###non-breaking changes
- bug fixes #2

###new-features
- Added options for folder nodes: `folderNodeName` and `folderNodeTitle`
- Added `responseHandler` for customizing ajax response data
- Added `nodeFormatter` for customizing the tree nodes

#v0.0.2
- Added options to automatocally load data via AJAX