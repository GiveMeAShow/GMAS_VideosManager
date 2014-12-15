angular.module("FilePresenter", ['angularTreeview'])

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

    .controller('FilePresenterRawController', ['$scope', 'EVENTS', '$q',
    	function($scope, EVENTS,  $q) {
            $scope.tree = {};
            $scope.tree.name = "fileTree";
            $scope.tree.files = [];
            
            $scope.add = function()
            {
                console.log("coucou");
                $scope.tree.files.push({name:"lol", id:47, children : [{name : "caca", id:56}]});
            }
            
            $scope.$on(EVENTS.FILES.LOADED, function(event, files) {
                $scope.tree.files.push({name : "caca", id:1});
                while ($scope.tree.files.length > 0)
                {
                    $scope.tree.files.pop();
                }
                $scope.tree.files.push(files); 
                $scope.$apply();
                /*$scope.tree.files.concat(files);*/
                console.log($scope.tree.files.length);
            });
    }]);
