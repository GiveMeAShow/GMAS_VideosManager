angular.module("amazon.services", [])

    .factory("AmazonFiles", ['$http', '$rootScope', 'EVENTS', function($http, $rootScope, EVENTS) {
        
		var File = {};
		var _aws = require('aws-sdk');
		_aws.config.update({accessKeyId: 'AKIAJSHTIKIM5SE2M25A', secretAccessKey: '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'});
		_aws.config.update({region: 'eu-west-1'});
		var _s3 = new _aws.S3();
		
		var _serverFiles = [];
		
		var params = {
		  Bucket: 'givemeashowvideos'
		};
        _s3.listObjects(params, function(err, data) {
			if (err) console.log("an error occured"); // an error occurred
			else                // successful response
			{
				for (var i = 0; i < data.Contents.length; i++)
				{
					var file = {};
					file.name = data.Contents[i].Key;
					_serverFiles.push(file);
					$rootScope.$broadcast(EVENTS.FILE.LOADED, file);
				}
			}
		});
		
		
		File.list = function() {
			
		}
		
		return File;
    }]);


