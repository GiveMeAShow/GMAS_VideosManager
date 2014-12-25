angular.module("FileStatusModule", [])

.directive('fileStatusBar', [function() {
    return {
        scope : {},
        controller : 'FileStatusBarController',
        link: function(scope, element, attrs) {
            scope.currentFile = "";
        },
        templateUrl : 'js/ui/FileStatus/FileStatusBar.html'
    }
}])

.controller("FileStatusBarController", ['$scope', 'EVENTS',
    function($scope, EVENTS) {
        $scope.$on(EVENTS.FILE.CHANGE, function(event, file) {
            $scope.currentFile = file;
        })
    
}])