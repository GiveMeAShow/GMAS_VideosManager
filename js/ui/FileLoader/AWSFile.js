angular.module("givemeashow.manager.file.services", [])

    .factory("FileService", ['$http', '$rootScope', 'EVENTS', function($http, $rootScope, EVENTS) {
        
		var File = {};
		var _aws = require('aws-sdk');
		_aws.config.update({accessKeyId: 'AKIAJSHTIKIM5SE2M25A', secretAccessKey: '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'});
		_aws.config.update({region: 'eu-west-1'});
		var _s3 = new _aws.S3();
		
		var _serverFiles = [];
		
		var params = {
		  Bucket: 'givemeashowvideos'
		};
		/*_s3.listObjects(params, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else                // successful response
			{
				for (var i = 0; i < data.Contents.length; i++)
				{
					var file = {};
					file.name = data.Contents[i].Key;
					_serverFiles.push(file);
					$rootScope.$broadcast(EVENTS.FILE.LOADED, file);
				}
			}
		});*/
		
		
		File.list = function() {
			
		}
		
		return File;
    }])

	.service("LocalFile", ['$http', '$rootScope', 'EVENTS', 'FILES', function($http, $rootScope, EVENTS, FILES) {
        
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


