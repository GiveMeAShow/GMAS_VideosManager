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

    .controller('FilePresenterRawController', ['$scope', 'EVENTS', 'MENUS', '$q', '$rootScope', 'FileService',
    	function($scope, EVENTS, MENUS, $q, $rootScope, FileService) {
			$scope.menus = [];
			for (var i = 0; i < MENUS.LIST.length; i++)
			{
				var menu = MENUS.LIST[i];
				if (i == 0)
				{
					menu.selected = true;	
				}
				else
				{
					menu.selected = false;
				}
				
				$scope.menus.push(menu)
			}
			console.log($scope.menus);
			
			
           $scope.select = function(menu)
		   {
			   for(var i = 0; i < $scope.menus.length; i++)
			   {
				   if($scope.menus[i].event === menu)
				   {
					   $scope.menus[i].selected = true;
					   $rootScope.$broadcast(EVENTS.MENU.CHANGED, menu);
				   }
				   else
				   {
					   $scope.menus[i].selected = false;
				   }
			   }
		   }
            
           
    }]);
