angular.module("FileProviderModule", [])

.factory("FileProvider", ['$rootScope', 'EVENTS', function($rootScope, EVENTS){
    var FileProvider = {};
    
    var _ErrorComputer;

    var _files = {};
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
        var f = true;
        while(f)
        {
            var f = _position.children.pop();
            if(f) newDir.children.push(f);
        }
        
        newDir.name = directoryName;
        // file.separator ?
        newDir.path = newDir.path + "\\" + directoryName;
        for(var i =0; i < newDir.children.length; i++)
        {
            var f = newDir.children[i];
            f.path = f.path.substring(0, f.path.lastIndexOf("\\") + 1) + newDir.name + f.path.substring(f.path.lastIndexOf("\\"));
        }
        
        _position.children.push(newDir);
    }
    
    FileProvider.getCurrent = function()
    {
        return _position;
    }

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