angular.module("OutputChooserModule", ['FileProviderModule'])

.directive("outputChooser", [function() {
	return {
		scope : {},
		controller: 'OutputChooserController',
		link : function(scope, element, attrs) {
			element.bind('drop', function(event) {
				event.preventDefault();
				event = event.originalEvent;
				if (event.dataTransfer.files.length > 0)
				{
					scope.outputPath = event.dataTransfer.files[0].path;
					scope.$apply();
				}
			})
			
			
		},
		templateUrl : 'js/ui/OutputChooser/OutputChooser.html'
	}
}])

.controller("OutputChooserController", ['$scope', 'FileProvider',
	function($scope, FileProvider) {
		
	this.pathModule = require('path');
	this.fileSystem = require('fs');
	this.fileAPI = require('file');
	this.mkdirp = require('mkdirp');
	$scope.outputPath = "";
		
	$scope.startCopy = function()
	{
		var file = FileProvider.getFiles();
		
		self.mkdirp($scope.outputPath, function(err) {
				console.log("Cannot create directory or directory exists.");
		});
		
		$scope.copy(file, $scope.outputPath);
		
		/*var cbCalled = false;

		var rd = fs.createReadStream(source);
			rd.on("error", function(err) {
			done(err);
		});
		
		var wr = self.fileSystem.createWriteStream(target);
			wr.on("error", function(err) {
			done(err);
		});
		
		wr.on("close", function(ex) {
			done();
		});
		
		rd.pipe(wr);

		function done(err) {
			if (!cbCalled) {
			  cb(err);
			  cbCalled = true;
			}
		}*/
		
		
		console.log(file);
	}
	
	$scope.copy = function(file, parentPath)
	{
		console.log("copying " + parentPath + "/" +file.name);
		var outputName = parentPath + "/" + file.name;
		
		if (file.type === "DIRECTORY")
		{
			self.mkdirp(outputName, function(err) {
				console.log("Cannot create directory or directory exists.");
			});
			for (var i = 0; i < file.children.length; i++)
			{
				$scope.copy(file.children[i], outputName);
			}
		}
		else
		{
			var rd = self.fileSystem.createReadStream(file.path);

			rd.on("error", function(err) {
					console.log(err);
			});

			var wr = self.fileSystem.createWriteStream(outputName);

			wr.on("error", function(err) {
				console.log(err);
			});

			wr.on("close", function(ex) {

			});

			rd.pipe(wr);
		}
	}
	var self = this;
}]);
























