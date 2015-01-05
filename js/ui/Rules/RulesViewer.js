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
	$scope.rules = [
	{
		name : "replace",
		params : ["To replace (regex)", "Replace by"], // strng to replace, act like a replaceAll
		placeholders : ["To replace (regex)", "Replace by"],
		scope : "Files in directory"
	}, {
		name: "moveChars",
		params: ["Begin index", "End index", "Target index position"], // beginIndex, endIndex and target position
		placeholders : ["Begin index", "End index", "Target index position"],
		scope: "Files in directory"
	}, {
		name : "movePosition",
		params: ["Begin index", "End index"], // beginIndex, endIndex of the number
		placeholders : ["Begin index", "End index"],
		scope : "Files in directory"
	}, {
		name : "moveInDirectory",
		params: ["New directory name"], // new dir name
		placeholders : ["New directory name"],
		scope : "Files in directory"
	}];
    $scope.sRule = $scope.rules[0];
	$scope.sParams = [];
	$scope.rParams = [];
    $scope.currentFile = {};
    $scope.currentFile.rules = [];
	
	$scope.$on(EVENTS.FILE.SELECTION, function(event, selectObj) {
		console.log($scope.rParams);
		if ($scope.rParams.length >= 2)
		{
			if ($scope.sRule.name == "replace")
			{
				$scope.sParams[0] = selectObj.text;
			}
			else
			{
				$scope.sParams[0] = selectObj.beginIndex;
				$scope.sParams[1] = selectObj.endIndex;
			}
		}
	})
	

	$scope.updateParams = function(rule)
	{
		$scope.sRule = rule;
		while($scope.rParams.length > 0) {
    			$scope.rParams.pop();
			}
		for (var i = 0; i < rule.params.length; i++)
		{
			$scope.sParams[i] = "";
			$scope.rParams.push(rule.params[i]);
		}
		console.log($scope.rParams);
	}
	/*$scope.watch("sRule", function(oldoBj, newObj) {
		while($scope.params.length > 0) {
    			$scope.params.pop();
			}
		for (var i = 0; i < $scope.newObj.params.length; i++)
			
		{
			$scope.params.push($scope.params.newObj[i]);
		}
	});*/

    $scope.applyR = function() {
		console.log("Applying", $scope.sRule);
		console.log("With params", $scope.sParams);
		var rule = $scope.sRule;
        
        if (rule.scope === "Files in directory")
        {
            var currentDir = FileProvider.getCurrent();
            
            for (var i = 0; i < currentDir.children.length; i++)
            {
                var f = currentDir.children[i];
				if (f.selected)
				{
					if (rule.name === "replace")
					{
						var param = new RegExp($scope.sParams[0], 'g');
						f.name = f.name[rule.name](param, $scope.sParams[1]);
						FileProvider.setFileName(f.name, i);
						FileProvider.addRuleToFile(i, rule, $scope.sParams);
					}
					else if (rule.name === "moveChars")
					{
						var extracted = f.name.substring($scope.sParams[0], rule.params[1]);
						f.name = f.name.replace(extracted, "");
						f.name = f.name.substring(0, $scope.sParams[2]) +
							extracted + f.name.substring($scope.sParams[2]);
						console.log("moving chars ", extracted);
						FileProvider.addRuleToFile(i, rule, $scope.sParams);
					}
					else if (rule.name === "movePosition")
					{
						var extracted = f.name.substring($scope.sParams[0], $scope.sParams[1]);
						f.name = f.name.replace(extracted, "");
						f.name = extracted + "-" + f.name;
						console.log("moving ", extracted);
						FileProvider.addRuleToFile(i, rule, $scope.sParams);
					}
					else if (rule.name = "moveInDirectory")
					{
						FileProvider.moveChildrenInNewDir($scope.sParams[0]);
					}
				}
            }
			FileProvider.addRuleToCurrentFile(rule, $scope.sParams);
            
        }
		
		//$scope.sParams = [];
		$scope.tableParams.reload();
        $rootScope.$broadcast(EVENTS.FILES.UPDATED, FileProvider.getCurrent());
    }
	
     $scope.$on(EVENTS.FILES.UPDATED, function(event, file) {
            $scope.currentFile = file;
       		$scope.tableParams.reload();
        })
        
        
    $scope.$on(EVENTS.FILE.CHANGE, function(event, file) {
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