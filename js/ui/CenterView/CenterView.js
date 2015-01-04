angular.module("CenterViewModule", ['MenuBarModule', 'FileViewerModule', 'RulesModule',
									'FileStatusModule', 'OutputChooserModule'])

.directive("centerView", [function() {
    return {
        scope : {},
        controller : "CenterViewController",
        link: function(scope, element, attrs) {
            
        },
        templateUrl : 'js/ui/CenterView/CenterView.html'
    }
}])

.controller("CenterViewController", ['$scope', 'EVENTS', 'MENUS',
                                function($scope, EVENTS, MENUS) {
    //TODO : Externalize into another controller ? Set views ? :)
    $scope.contents = [false, true];
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
			
}])