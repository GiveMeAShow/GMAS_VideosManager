var app = angular.module("app", ['FileViewerModule','givemeashow.manager.file.services', 'FilePresenter', 'angularTreeview'])

.constant("EVENTS", {
		"FILE":{
			"LOADED" : "file.loaded",
			"UPLOADED" : "file.uploaded"
		}
})
.constant("FILES", {
    "FILE" : "FILE",
    "DIRECTORY" : "DIRECTORY"
});

/*var path = require('path');*/

// used only to get some node files
/*require(path.join(process.cwd(),"js/ui/FileLoader/FileLoader.js"));*/

window.ondragover = function(e) { e.preventDefault(); return false; }