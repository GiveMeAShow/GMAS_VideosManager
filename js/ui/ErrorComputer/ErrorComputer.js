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
    
    var ErrorComputer = function() {
        
        this.computeErrors = function(rootFile)
        {
            if (rootFile.children)
            {
                _checkForDoublons(rootFile);
                
                for (var i = 0; i < rootFile.children.length; i ++)
                {
                    var showFile = rootFile.children[i];
                    var showName = showFile.name;
                    var showDirErrorCount = 0;
                    for (var j = 0; j < showFile.children.length; j ++)
                    {
                        var seasonFile = showFile.children[j];
                        var showDirErrorCount = _checkForDirt(seasonFile);
                        for (var k = 0;seasonFile.children && k < seasonFile.children.length; k++)
                        {
                            var langFile = seasonFile.children[k];
                            var lang = langFile.name;
                            console.log(lang);
                            if (lang.length > 2)
                            {
                                var error ="Malformed or missing lang directory";
                                langFile.errors.push(error);
                                seasonFile.errors.push(error);
                                showFile.errors.push(error);
                            }
                            
                            for (var l = 0; langFile.children && l < langFile.children; l++)
                            {
                                var videoFile = langFile.children[l];
                                var videoPosition = videoFile.substring(0, videoFile.lastIndexOf("-"));
                                if (!videoPosition.isNumber)
                                {
                                    var error = "Cannot get video position";
                                    videoFile.errors.push(error);
                                }
                                var tempVName = videoFile.substring(videoFile.lastIndexOf("-"));
                                
                            }
                        }
                    }
                }
            }
        }
    }
    
    return new ErrorComputer();
}])