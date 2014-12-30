angular.module("ErrorComputerModule", [])

.factory("ErrorComputer", [function(){
    

    var _checkForDoublons = function(file)
    {
        for (var i = 0; i < file.children.length; i ++)
        {
            for (var j = i + 1; j < file.children.length; j ++)
            {
                if (file.children[i].name === file.children[j].name)
                {
                    file.children[i].errors.push("Name in doublons !");
                    file.children[j].errors.push("Name in doublons !");
                    file.errors.push("Contains doublons !");
                    break;
                }
            }
        }
    }
    
    var stopList  = [".", " ", "/", "\\", "%", "ù", "*"];
    
    var _checkForDirt = function(file)
    {
        var count = 0;
        for (var i = 0; i < stopList.length; i++)
        {
            if (file.name.lastIndexOf(stopList[i]) != -1)
            {
                var err = "Contains '" + stopList[i] + "'";
                file.errors.push(err);
                console.log(err);
                count = count + 1;
            }
        }
        return count;
    }
    
    var _clean = function(file) {
            
        while(file.errors.length > 0) {
                file.errors.pop();
            }
    }
    var ErrorComputer = function() {
        
        this.computeErrors = function(rootFile)
        {
            _clean(rootFile);
            if (rootFile.children)
            {
                _checkForDoublons(rootFile);
                
                for (var i = 0; i < rootFile.children.length; i ++)
                {
                    var showFile = rootFile.children[i];
                    _clean(showFile);
                    var showName = showFile.name;
                    var showDirErrorCount = 0;
                    for (var j = 0; j < showFile.children.length; j ++)
                    {
                        var seasonFile = showFile.children[j];
                        _clean(seasonFile);
                        var showDirErrorCount = _checkForDirt(seasonFile);
                        
                        var langs = ["fr"]; // todo : read from property
                        var langFound = false;
                        for (var k = 0; seasonFile.children && k < seasonFile.children.length; k++)
                        {
                            var langFile = seasonFile.children[k];
                            _clean(langFile);
                            var lang = langFile.name;
                            if (lang === langs[0]) // test si on a trouvé la langue
                            {
                                langFound = true;
                            }
                            
                            for (var l = 0; langFile.children && l < langFile.children; l++)
                            {
                                var videoFile = langFile.children[l];
                                _clean(videoFile);
                                var videoPosition = videoFile.substring(0, videoFile.lastIndexOf("-"));
                                if (!videoPosition.isNumber)
                                {
                                    var error = "Cannot get video position";
                                    videoFile.errors.push(error);
                                }
                                var tempVName = videoFile.substring(videoFile.lastIndexOf("-"));
                                
                            }
                        }
                        if (!langFound)
                        {
                            var error ="Missing lang directory '" + langs[0] + "'";
                            seasonFile.errors.push(error);
                            showFile.errors.push(error);
                        }
                    }
                }
            }
        }
    }
    
    return new ErrorComputer();
}])