angular.module("FileProviderModule", [])

.factory("FileProvider", ['$rootScope', 'EVENTS', function($rootScope, EVENTS){
    var FileProvider = {};
    
    var _ErrorComputer;

    var _files = [];
    var _position = {};

    var _visited = [];
        
    FileProvider.setFiles = function(files)
    {
        _files = files;
        _files.root = true;
        _position = _files;
        if (_ErrorComputer)
        {
            _ErrorComputer.computeErrors(_files);
        }
        return _position;
    }

    FileProvider.setErrorComputer = function(ErrorComputer)
    {
        _ErrorComputer = ErrorComputer; 
    }

    FileProvider.addFile = function(file)
    {
        _files.push(file);
    }
	
	FileProvider.addRuleToFile = function(i, rule, params)
	{
		var newRule = {};
		newRule.name = rule.name;
		newRule.params = [];
		newRule.scope = rule.scope;
		for (var j = 0; j < params.length; j++)
		{
			newRule.params.push(params[j]);
		}
		_position.children[i].rules.push(newRule);
	}
	
	FileProvider.addRuleToCurrentFile = function(rule, params)
	{
		
		console.log("Adding rule ", rule);
		var newRule = {};
		newRule.name = rule.name;
		newRule.params = [];
		newRule.scope = rule.scope;
		for (var i = 0; i < params.length; i++)
		{
			newRule.params.push(params[i]);
		}
		_position.rules.push(newRule);
	}

    FileProvider.moveChildrenInNewDir = function(directoryName)
    {
        // would be easier by copy
        var newDir = {
            children : [],
            type : _position.type,
            path : _position.path,
            rules : _position.rules,
            errors : _position.errors
        };
		
		for (var i =0; i < _position.children.length; i++)
		{
			var file = _position.children[i];
			if (file.selected)
			{
				newDir.children.push(file);
				_position.children.splice(i, 1);
			}
		}
        console.log(newDir);
		
        newDir.name = directoryName;
        // file.separator ?
        newDir.path = newDir.path + "\\" + directoryName;
		
        for(var i =0; i < newDir.children.length; i++)
        {
			_visitChildren(newDir.children[i], _moveIntoDirectory, newDir)
        }
		
		console.log(newDir);
        _position.children.push(newDir);
        if (_ErrorComputer)
        {
            _ErrorComputer.computeErrors(_files);
        }
    }
	
	var _moveIntoDirectory = function(file, newDir) {
		//file.path = file.path.substring(0, file.path.lastIndexOf("\\") + 1) + newDir.name + file.path.substring(file.path.lastIndexOf("\\"));
		//file.path = file.path.substring(0, file.path.lastIndexOf("\\") + 1) + newDir.name + file.path.substring(file.path.lastIndexOf("\\"));
		if (file.type === "DIRECTORY")
		{
			for (var i = 0; i < file.children.length; i++)
			{
				var f = file.children[i];
				f.path = file.path + "/" + f.name;
			}
		}
	}
	
	var _visitChildren = function(dir, executeOnEach, param)
	{
		executeOnEach(dir, param);
		if (dir.type === "DIRECTORY")
		{
			for (var i = 0;i < dir.children.length; i ++)
			{
				_visitChildren(dir.children[i], executeOnEach, param);
			}
		}
	}
	
	FileProvider.selectAll = function(value)
	{
		_visitChildren(_position, function(file) {
			file.selected = value;
		})
	}
	
	FileProvider.select = function(index, value)
	{
		_visitChildren(_position.children[index], function(file) {
			file.selected = value;
		})
	}
    
	FileProvider.getFiles = function() { return _files }; 
	
    FileProvider.getCurrent = function() { return _position };

    FileProvider.moveBack = function()
    {
        _position = _visited.pop();
        return _position;
    }
    
    FileProvider.setFileName = function(name, index)
    {
        if (index != undefined)
        {
            _position.children[index].name = name;
        }
        else
        {
            _position.name = name;
        }
    }

    FileProvider.move = function(childIndex)
    {
        if (_position.children && _position.children[childIndex].children)
        {
            _visited.push(_position);
            _position = _position.children[childIndex];    
        }
        else
        {
            return _position.children[childIndex]; 
        }
        return _position;
    }     
    
    return FileProvider;
}])