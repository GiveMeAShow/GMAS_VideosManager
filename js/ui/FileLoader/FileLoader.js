angular.module("FileViewerModule", ['givemeashow.manager.file.services', 'ngTable'])

    .directive('fileViewer', function($compile) {
        return {
            restrict: 'E',
            scope: {},
            controller: 'fileViewerController',
            replace: true, // Replace with the template below
            link: function(scope, element, attrs) {
                element.ondragover = function(e) { e.preventDefault(); return false; }
			   
			    scope.message = "Drop the file";
				scope.loaderOver = false;
				
				element.bind('dragover', function() {
					scope.loaderOver = true;
					scope.message = "Drop a directory here";
					scope.$apply();
					return false;
				});
				
				var ondragleave = function() {
					scope.loaderOver = false;
					scope.$apply();
					return false;
				};
				
				
				element.bind('dragleave', ondragleave);
				var el = $("#fileLoaderContainer");
			
				element.bind('drop', function(e) {
					e.preventDefault();
					e = e.originalEvent;
					for (var i = 0; i < e.dataTransfer.files.length; i++) {
						var file = e.dataTransfer.files[i].path;
						scope.message = file;
						scope.localRoot = file;
						scope.$apply();
						scope.loadFiles(e.dataTransfer.files[i].path);
					}
					scope.message = "";
					ondragleave();
				});

				var ondrop = function(e) {
					

				}
        },
        templateUrl: 'js/ui/FileLoader/FileLoaderDropZone.html'
      };
    })

    .controller('fileViewerController', ['$scope', '$filter', '$rootScope', 'EVENTS', 'MENUS', 'FileService', 'LocalFile', 'ngTableParams',
    	function($scope, $filter, $rootScope, EVENTS, MENUS, FileService, LocalFile, ngTableParams) {
		$scope.serverFiles = [];
		$scope.localFiles = [];
		$scope.localRoot = "";
		$scope.localEmpty =  true;
			
		$scope.contents = [false, true];
			
		$scope.loadFiles = function (files) {
			LocalFile.loadFiles(files, $scope.files);
        }
		
		$scope.select = function(file)
		{
			
		}
		
		$scope.parentFile = {};
			
		$scope.move = function(dir)
		{
			while($scope.localFilesVisible.length > 0) {
    			$scope.localFilesVisible.pop();
			}
			
			
			if(dir.name != $scope.localRoot.name)
			{
				var f = {};
				f = $scope.parentFile;
				f.back = true;
				$scope.localFilesVisible.push(f);
			}
			for(var i = 0; i < dir.children.length; i ++)
			{
				var f = {};
				f.name = dir.children[i].name;
				f.path = dir.children[i].path;
				f.selected = false;
				if(dir.children[i].children)
				{
					f.children = dir.children[i].children;
				}
				else
				{
					f.name = dir.children[i].name;
					f.path = dir.children[i].path.replace($scope.localRoot, '');
				}
				
				console.log(f);
				$scope.localFilesVisible.push(f);
			}
			$scope.tableParams.reload();
			$scope.parentFile = dir;
		}
		
		
		
		var walk = function(file)
		{
			for(var i = 0; i < file.length; i ++)
			{
				var f = {};
				f.name = file[i].name;
				f.path = file[i].path;
				f.selected = false;
				if(file[i].children)
				{
					f.children = file[i].children;
					$scope.localFiles.push(f);
					walk(file[i].children);
				}
				else
				{
					var f = {};
					f.name = file[i].name;
					f.path = file[i].path.replace($scope.localRoot, '');
					$scope.localFiles.push(f);
				}
			}
		}
		
		$scope.loader = { loading: false, total : 0 };
		$scope.localFilesVisible = [];
		
		$scope.$on(EVENTS.FILES.LOADED, function(event, files) {
			$scope.localEmpty =  false;
			$scope.loader.loading = true;
			$scope.localFiles = [];
			
			$scope.localRoot = files;
			$scope.parentFile = $scope.localRoot;
			$scope.move(files);
			$scope.tableParams.reload();
			
			//var file = walk(files.children);
			
			$scope.loader.total = $scope.localFiles.length;
			$scope.loader.loading = false;
			$scope.$apply();
		})

		$scope.$on(EVENTS.FILE.LOADED, function(event, file) {
			$scope.serverFiles.push(file);
			
			$scope.$apply();
			console.log($scope.files);
		});
			
		$scope.$on(EVENTS.MENU.CHANGED, function(event, menu) {
			if (menu == MENUS.HOME)
			{
				for (var i = 0; i < $scope.contents.length; i++)
				{
					$scope.contents[i] = true;
				}
				$scope.contents[0] = false;
			}
			else if (menu == MENUS.SERVER)
			{
				for (var i = 0; i < $scope.contents.length; i++)
				{
						$scope.contents[i] = true;
				}
				$scope.contents[1] = false;
			}
		});
		
		/*$scope.$watch("loader", function () {
			if(!$scope.loader.loading)
			{
        		$scope.tableParams.reload();
			}
    	}, true); */
			
		$scope.tableParams = new ngTableParams({
			page: 1,            // show first page
			count: 10,          // count per page
			sorting: {
				name: 'asc'     // initial sorting
			}
		}, {
			total: function () { return getData().length; }, // length of data
			getData: function($defer, params) {
				var filteredData = $scope.localFilesVisible;
				var orderedData = params.sorting() ?
									$filter('orderBy')(filteredData, params.orderBy()) :
									filteredData;
				params.total($scope.localFilesVisible.length);
				if (orderedData.length <= params.count())
				{
					$defer.resolve(orderedData);
				}
				else
				{
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			},
			$scope: { $data: {} }
		}); 
		$scope.tableParams.settings().$scope = $scope;
    }]);
