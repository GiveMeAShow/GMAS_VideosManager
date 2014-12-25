angular.module("RulesModule", ['ngTable', 'FileProviderModule'])

.directive("rulesViewer", [function() {
    return {
        scope : {},
        controller : 'RulesViewerController',
        link : function(scope, element, attrs) {
            scope.addingRule = false;
            scope.newRule = function() {
                scope.addingRule = true;
            }
        },
        templateUrl: 'js/ui/Rules/RulesViewer.html'
    }
}])

.controller("RulesViewerController", ['$scope', '$filter', '$rootScope', 'EVENTS', 'ngTableParams', 'FileProvider',
    function($scope, $filter, $rootScope, EVENTS, ngTableParams, FileProvider) {
    
    $scope.currentFile = {};
    $scope.currentFile.rules = [];
    $scope.rulesFilters = {"replaceAll" : function(from, to) {
        
    }}    
    
    $scope.applyR = function(rule) {
        // utiliser le ng-model=rule.params[0] ec.. pour les rajouter (maybe...)
        /*rule.params[0] = " |QC|Saison 2|-";
        rule.params[1] = "_";*/
        
        // pour move il faut donner les deu index.. et non pas la longueur
        /*rule.name = "movePosition";
        rule.params = [14, 16, 0];
        rule.scope = "Files in directory";*/
        
        rule.name = "moveInDirectory";
        rule.params = ['fr'];
        rule.scope = "Files in directory";
        
        if (rule.scope === "Files in directory")
        {
            var currentDir = FileProvider.getCurrent();
            
            for (var i = 0; i < currentDir.children.length; i++)
            {
                var f = currentDir.children[i];
                if (rule.name === "replace")
                {
                    var param = new RegExp(rule.params[0], 'g');
                    f.name = f.name[rule.name](param, rule.params[1]);
                    FileProvider.setFileName(f.name, i);
                }
                else if (rule.name === "move")
                {
                    var extracted = f.name.substring(rule.params[0], rule.params[1]);
                    f.name = f.name.replace(extracted, "");
                    f.name = f.name.substring(0, rule.params[2]) +
                        extracted + f.name.substring(rule.params[2]);
                    console.log("moving ", extracted);
                }
                else if (rule.name === "movePosition")
                {
                    var extracted = f.name.substring(rule.params[0], rule.params[1]);
                    f.name = f.name.replace(extracted, "");
                    f.name = extracted + "-" + f.name;
                    console.log("moving ", extracted);
                }
                else if (rule.name = "moveInDirectory")
                {
                    FileProvider.moveChildrenInNewDir(rule.params[0]);
                }
                console.log(f.name);
            }
            
        }
        $rootScope.$broadcast(EVENTS.FILES.UPDATED);
    }
    
    $scope.ruleChooser = [
        {
            name : "replace",
            params : ["", ""], // strng to replace, act like a replaceAll
            scope : "Files in directory"
        }, {
            name: "move",
            params: ["", "", ""], // beginIndex, endIndex and target position
            scope: "Files in directory"
        }, {
            name : "movePosition",
            params: ["", ""], // beginIndex, endIndex of the number
            scope : "Files in directory"
        }, {
            name : "moveInDirectory",
            params: [""], // new dir name
            scope : "Files in directory"
        }];
        
        
    $rootScope.$on(EVENTS.FILE.CHANGE, function(event, file) {
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