angular.module("OutputChooserModule", ['FileProviderModule', 'ui.bootstrap'])

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
		if ($scope.outputPath != "")
		{
			var file = FileProvider.getFiles();

			self.mkdirp($scope.outputPath, function(err) {
					console.log("Cannot create directory or directory exists.");
			});

			$scope.copy(file, $scope.outputPath);
			$scope.max = $scope.pairs.length;
			$scope.processCopy();


			console.log(file);
		}
	}
	
	$scope.pairs = [];
	$scope.copying = false;
	$scope.processed = 0;
	$scope.max = 0;
	
	$scope.cancelCopy = false;
		
	$scope.processCopy = function()
	{
		var pair = $scope.pairs.pop();
		if (pair && !$scope.cancelCopy)
		{
			$scope.copying = true;
			var rd = self.fileSystem.createReadStream(pair.src);
			var wr = self.fileSystem.createWriteStream(pair.dest);
			console.log("copying " + pair.src + "/" + pair.dest);
			wr.on("close", function() {
				console.log("File ", pair.src, " copied to ", pair.dest);
				$scope.processed = $scope.processed + 1;
				$scope.$apply();
				$scope.processCopy();
				
			});
			rd.pipe(wr);
		}
		else
		{
			console.log("Copy ended");
			$scope.copying = false;
			$scope.max = 0;
			$scope.processed = 0;
			$scope.cancelCopy = false;
			while($scope.pairs.length > 0)
			{
				$scope.pairs.pop();
			}
			
		}
	}
	
	$scope.copy = function(file, parentPath)
	{
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
			$scope.pairs.push({"src" : file.path, "dest" : outputName});
			$scope.nbToProcess = $scope.nbToProcess + 1;
		}
	}
	var self = this;
}]);
























