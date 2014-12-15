angular.module("givemeashow.manager.file.services", [])

    .factory("FileService", ['$http', '$rootScope', 'EVENTS', function($http, $rootScope, EVENTS) {
        
		var File = {};
		var _aws = require('aws-sdk');
		_aws.config.update({accessKeyId: 'AKIAIJF2JQJBD75ZRITA', secretAccessKey: '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'});
		_aws.config.update({region: 'eu-west-1'});
		var _s3 = new _aws.S3();
		
		var _serverFiles = [];
		
		var params = {
		  Bucket: 'givemeashowvideos'
		};
		_s3.listObjects(params, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
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
		
		/*_s3.listBuckets(function(err, data) {
		  for (var index in data.Buckets) {
			var bucket = data.Buckets[index];
			console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
		  }
		});*/
		
		File.list = function() {
			
		}
		
		return File;
    }]);
