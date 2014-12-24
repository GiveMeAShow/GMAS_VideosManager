angular.module("FileProviderModule", [])

.factory("FileProvider", ['$rootScope', 'EVENTS', function($rootScope, EVENTS){
    var FileProvider = function() {
        var _ErrorComputer;

        var _files = {};
        var _position = {};

        var _visited = [];
        
        this.setFiles = function(files)
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

        this.setErrorComputer = function(ErrorComputer)
        {
            _ErrorComputer = ErrorComputer; 
        }

        this.addFile = function(file)
        {
            _files.push(file);
        }


        this.getCurrent = function()
        {
            return _position;
        }
        
        this.moveBack = function()
        {
            _position = _visited.pop();
            return _position;
        }

        this.move = function(childIndex)
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
    };
    return FileProvider;
}])