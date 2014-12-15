angular.module("FileViewerModule", ['givemeashow.manager.file.services'])

    .directive('fileViewer', function($compile) {
        return {
            restrict: 'E',
            scope: {},
            controller: 'fileViewerController',
            replace: true, // Replace with the template below
            link: function(scope, element, attrs) {
               
        },
        templateUrl: 'js/ui/FileLoader/FileLoaderDropZone.html'
      };
    })

    .controller('fileViewerController', ['$scope', '$rootScope', 'EVENTS', 'FileService',
    	function($scope, $rootScope, EVENTS, FileService) {
			
           $scope.$on(EVENTS.FILE.LOADED, function(event, file) {
			  console.log(file); 
		   });
			
    }]);
