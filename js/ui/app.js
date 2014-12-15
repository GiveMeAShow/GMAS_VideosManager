var app = angular.module("app", ['FileLoader', 'FilePresenter', 'angularTreeview'])
.constant("EVENTS", {
        "FILES": {
            "LOADED" : "LOADED"
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