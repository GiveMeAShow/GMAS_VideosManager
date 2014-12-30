var app = angular.module("app", ['ngTable', 'CenterViewModule', 'angularTreeview'])

.constant("EVENTS", {
		"FILE":{
			"LOADED" : "file.loaded",
			"UPLOADED" : "file.uploaded",
            "CHANGE" : "file.changed",
			"SELECTION" : "file.selection"
		},
		"FILES" : {
			"REPLACE" : "files.replace",
            "UPDATED" : "files.updated"
		},
		"MENU" : {
			"CHANGED" : "menu.changed"
		}
})

.constant("FILES", {
    "FILE" : "FILE",
    "DIRECTORY" : "DIRECTORY"
})

.constant("MENUS", {
	"HOME" : "HOME",
	"SERVER" : "SERVER",
	"LIST" : [
		{"name": "Home", "event" : "HOME"},
		{"name" :"Server", "event" : "SERVER"}
	]
});

/*var path = require('path');*/

// used only to get some node files
/*require(path.join(process.cwd(),"js/ui/FileLoader/FileLoader.js"));*/

window.ondragover = function(e) { e.preventDefault(); return false; }