angular.module("FileLoader", [])

    .directive('fileLoaderDropZone', function($compile) {
        return {
            restrict: 'E',
            scope: {},
            controller: 'fileLoaderDropZoneController',
            replace: true, // Replace with the template below
            link: function(scope, element, attrs) {
                element.ondragover = function(e) { e.preventDefault(); return false; }

                var el = $("#fileLoaderContainer");
                el.innerHtml = "caca";
                var ondragover = function() {
                    el.addClass("hover");
                    this.innerHTML = "Drop the file";
                    return false;
                }

                var ondragleave = function() {
                    el.removeClass("hover");
                    this.innerHTML = "Drop your icon there";
                    return false;
                }

                var ondrop = function(e) {
                    e.preventDefault();
                    e = e.originalEvent;
                    for (var i = 0; i < e.dataTransfer.files.length; i++) {
                        var file = e.dataTransfer.files[i].path;
                        this.innerHTML = file;
                        scope.loadFiles(e.dataTransfer.files[i].path);
                    }
                    ondragleave();

                }

                el.on("dragover", ondragover)
                  .on("dragleave", ondragleave)
                  .on("drop", ondrop);
        },
        templateUrl: 'js/ui/FileLoader/FileLoaderDropZone.html'
      };
    })

    .controller('fileLoaderDropZoneController', ['$scope', '$rootScope', 'FileLoaderService',
    	function($scope, $rootScope, FileLoaderService) {
            $scope.files = [];
            $scope.loadFiles = function (files) {
                //used to send event to all the children of the app
                /*$rootScope.$broadcast('LOAD_FILES', files);*/
                FileLoaderService.loadFiles(files, $scope.files);
            }
    }])

    .service("FileLoaderService", ['$http', '$rootScope', 'EVENTS', 'FILES', function($http, $rootScope, EVENTS, FILES) {
        
        $http.get("properties.json").success(function(results) {
           this.applicationProperties = results;
        });
        
        var _files = [];
        
        this.getFiles = function()
        {
            return _files;
        }
        
        this.setFiles = function(files)
        {
            _files = files;
        }
        
        this.addFile = function(file)
        {
            _files.push(file);
        }
        
        this.clearFiles = function()
        {
            _files = [];
        }

        this.pathModule = require('path');
        this.fileSystem = require('fs');
        this.fileAPI = require('file');


        this.rightExtension = function(extension)
        {
            if (applicationProperties.formats.lastIndexOf(extension) === -1)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        // walk through the (sub)directories
        this.startWalk = function (file, parent, done) {
            var fileToAdd = {};
            var processedFile = {};
            if (parent)
            {
                fileToAdd.path = parent + "\\" + file;
                fileToAdd.name = file;
            }
            else
            {
                fileToAdd.name = file;
                fileToAdd.path = file;
            }
            self.fileSystem.stat(fileToAdd.path, function(error, stats) {
                if (error)
                {
                    console.log(error);
                }
                else if (stats.isDirectory()) {
                    fileToAdd.children = [];
                    self.fileSystem.readdir(fileToAdd.path, function(error, fileList) {
                        console.log("Visiting ", fileToAdd.path);
                        fileList.forEach(function(file) {
                            
                            self.startWalk(file, fileToAdd.path, function(fileToAdd) {
                                fileToAdd.children.push(file)
                            });
                        });
                    });
                }
                else
                {
                    self.addFile(fileToAdd);
                }
            });
        }

        this.addDirectory = function(directory)
        {
            var toAdd = {};
            toAdd.name = directory.name;
            toAdd.path = directory.path;
            toAdd.directory = true;
            $rootScope.$broadcast(EVENTS.FILES.LOADED, toAdd);
            _files.push(toAdd);
        }

        this.addFile = function(file)
        {
            var toAdd = {};
            toAdd.name = file.name;
            toAdd.path = file.path;
            toAdd.directory = false;
            toAdd.extension = self.pathModule.extname(file.name);
            $rootScope.$broadcast(EVENTS.FILES.LOADED, toAdd);
            _files.push(toAdd);
        }

        // Here are all the files received from Angular. Conversion for NodeJS.
        this.loadFiles = function (files, arrayToFill) 
        {
            console.log("Extracting files for node");
            var fileTree = self.dirTree(files);
            console.log(fileTree);
            $rootScope.$broadcast(EVENTS.FILES.LOADED, fileTree);
        }
        this.fileId = 0;
        
        this.dirTree = function(filename) {
            var stats = self.fileSystem.lstatSync(filename),
                info = {
                    path: filename,
                    name: self.pathModule.basename(filename)
                };
            
            if (stats.isDirectory()) {
                info.type = FILES.DIRECTORY;
                info.children = self.fileSystem.readdirSync(filename).map(function(child) {
                    return self.dirTree(filename +self.pathModule.sep + child);
                });
            } else {
                // Assuming it's a file. In real life it could be a symlink or
                // something else!
                info.type = FILES.FILE;
            }
            self.fileId = self.fileId + 1;
            info.id = self.fileId;
            return info;
        }
        
        var self = this;
    }]);
