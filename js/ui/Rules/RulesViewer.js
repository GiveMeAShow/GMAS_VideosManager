angular.module("RulesModule", ['ngTable'])

.directive("rulesViewer", [function() {
    return {
        scope : {},
        controller : 'RulesViewerController',
        link : function(scope, element, attrs) {
            
        },
        templateUrl: 'js/ui/Rules/RulesViewer.html'
    }
}])

.controller("RulesViewerController", ['$scope', '$filter', '$rootScope', 'EVENTS', 'ngTableParams', 
    function($scope, $filter, $rootScope, EVENTS, ngTableParams) {
    
    $scope.currentFile = {};
    $scope.currentFile.rules = [];
        
    $rootScope.$on(EVENTS.FILE.CHANGE, function(event, file) {
       console.log("changed to ", file);
       $scope.currentFile = file;
       $scope.tableParams.reload(); 
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
				var filteredData = $scope.currentFile.rules;
				var orderedData = params.sorting() ?
									$filter('orderBy')(filteredData, params.orderBy()) :
									filteredData;
				params.total($scope.currentFile.rules.length);
                $defer.resolve(filteredData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			},
			$scope: { $data: {} }
		}); 
		$scope.tableParams.settings().$scope = $scope;
}])