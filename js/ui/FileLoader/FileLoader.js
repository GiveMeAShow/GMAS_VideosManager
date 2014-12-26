angular.module("FileViewerModule", ['ngTable', 'FileProviderModule', 'LocalFileLoaderModule'])

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

    .controller('fileViewerController', ['$scope', '$filter', '$rootScope', 'EVENTS', 'MENUS', 'LocalFileLoader', 'ngTableParams', 'FileProvider',
    	function($scope, $filter, $rootScope, EVENTS, MENUS, LocalFileLoader, ngTableParams, FileProvider) {
        var FP = new FileProvider();
		$scope.serverFiles = [];
		$scope.localFiles = [];
		$scope.localRoot = "";
		$scope.localEmpty =  true;
			
		$scope.loadFiles = function (files) {
			LocalFileLoader.loadFiles(files, $scope.files);
        }
		
		$scope.parentFile = {};
		$scope.visited = [];
            
        $scope.moveBack = function()
        {
            $scope.format(FP.moveBack());
        }
			
		$scope.move = function(childIndex, back)
		{
            $scope.format(FP.move(childIndex));
		}
        
        $scope.format = function (dir)
        {
            while($scope.localFilesVisible.length > 0) {
    			$scope.localFilesVisible.pop();
			}
            
            if (dir.root)
            {
                $scope.isRoot = true;
            }
            else
            {
              $scope.isRoot = false;  
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
                    f.dir = true;
				}
				else
				{
                    f.dir = false;
					f.name = dir.children[i].name;
					f.path = dir.children[i].path.replace($scope.localRoot, '');
				}
				$scope.localFilesVisible.push(f);
			}
            console.log($scope.localFilesVisible);
			$scope.tableParams.reload();
			$scope.parentFile = dir;
        }
		
		$scope.localFilesVisible = [];
		
        // when localfiles are loaded
		$scope.$on(EVENTS.FILES.LOADED, function(event, files) {
            $scope.format(FP.setFiles(files));
            
            
			$scope.localEmpty =  false;
			$scope.localFiles = [];
			
			$scope.localRoot = files;
			$scope.parentFile = $scope.localRoot;
			$scope.tableParams.reload();
			$scope.$apply();
		})

		$scope.$on(EVENTS.FILE.LOADED, function(event, file) {
			$scope.serverFiles.push(file);
			
			$scope.$apply();
			console.log($scope.files);
		});

        
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
