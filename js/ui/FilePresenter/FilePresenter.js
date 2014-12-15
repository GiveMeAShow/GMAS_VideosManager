angular.module("FilePresenter", ['angularTreeview', 'givemeashow.manager.file.services'])

    .directive('filePresenterRaw', function($compile) {
        return {
            restrict: 'E',
            scope: {},
            controller: 'FilePresenterRawController',
            replace: true, // Replace with the template below
            link: function(scope, element, attrs) {
               
        },
        templateUrl: 'js/ui/FilePresenter/FilePresenterRaw.html'
      };
    })

    .controller('FilePresenterRawController', ['$scope', 'EVENTS', '$q', 'FileService',
    	function($scope, EVENTS,  $q, FileService) {
            $scope.tree = {};
            $scope.tree.name = "fileTree";
            $scope.tree.files = [];
            
            $scope.add = function()
            {
                console.log("coucou");
                $scope.tree.files.push({name:"lol", id:47, children : [{name : "caca", id:56}]});
            }
            
           
    }]);
