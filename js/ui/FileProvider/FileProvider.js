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