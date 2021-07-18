(function() {

function createScenarioFrame() {
    if(model.alreadyMadeFrame == false){
    console.log("running make frame")
    createFloatingFrame("scenario_frame", 500, 250, { "snap": false, "top": 42, "rememberPosition": "false" });//this top offset is so player bar with eco mods doesn't overlap


    $.get("coui://ui/mods/scenario-ui/objective_ui_live_game.html", function (data) {
        $("#scenario_frame_content").append(data);
    });

    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "coui://ui/mods/scenario-ui/objective_ui_live_game.css"
    }).appendTo("head");

    
//forgetFramePosition("scenario_frame");

lockFrame("scenario_frame");

//-----------------------------------------------------------------Objective Display Functions---------------------------------------------------
model.alreadyMadeFrame = true;
}}

model.objectiveDescriptions =[];
model.objectiveProgresses = [];
model.objectiveNeeded = [];
model.objectiveResults = [];
model.testValue = ko.observable(0);
model.waveTime = null;

//prepares progress data before sending it to the ui


handlers.objectiveUpdate = function(payload) {
    if(model.alreadyMadeFrame === undefined){model.alreadyMadeFrame = false;}
    if(model.alreadyMadeFrame == false){createScenarioFrame();model.alreadyMadeFrame = true}
        if(payload === undefined || payload === 0 ){addLinkageLiveGame("model.objectiveModel()", "model.objectiveViewModel");console.log("active undefined");return} 
    else{
       
        var newObjectiveDescriptions = [];
        var newObjectiveProgresses = [];
        var newObjectiveNeeded = [];
        var newObjectiveResults =[];
        var newObjectiveSyntax = [];
        for(var i = 0;i<payload.length;i++){
           
            var objective = payload[i];
            var visible = objective.visible;
            var result = objective.result;
            var description = objective.description;
            var needed = objective.needed;
            var progress = objective.progress;
            var syntax = objective.syntax;
            if(syntax == undefined){syntax = ""}

            if(objective === undefined || visible === undefined || result === undefined || description === undefined || needed === undefined || progress === undefined){;}
            else{
                newObjectiveDescriptions.push(description)
                newObjectiveProgresses.push(progress)
                newObjectiveResults.push(result)
                newObjectiveNeeded.push(needed)
                newObjectiveSyntax.push(syntax)
            }
        }
        
        
        
        function updateSpan (className, array,syntax){

           
            if(array.length <4){for(var i = array.length;i<4;i++){array[i] = " "}}
            for(var i = 0;i<array.length;i++){
                
                if(syntax[i] == "/" && className == "progress"){// addes slash between progress and needed
                    array[i] = array[i] + "/"
                }
                if(syntax[i] == "%" && className == "progress"){//adds percent after progress and doesnt do needed
                    array[i] = array[i] + "%"
                }
                if(syntax[i] == "%" && className == "needed"){//adds percent after progress and doesn't do needed
                    return
                }
                if(syntax[i] == "king" && className == "needed"){return}
                if(syntax[i] == "king" && className == "progress"){//displays your percent and the lead players name and percent
                    
                    var finalString = "";
                    var topPlayerString = "";
                    var highestNum = 0;
                    var playerName = payload[i].playerName;
                    var playerNumber = 0;
                    for(var j = 0;j<array[i].length;j++){
                        if(array[i][j]>highestNum){highestNum = array[i][j]; topPlayerString = payload[0].playerNames[j]}
                        if(playerName == payload[0].playerNames[j]){playerNumber =  array[i][j]}
                    }
                   
                    finalString += (playerName+":"+playerNumber+"\r\n"+"Leader:"+topPlayerString+" with "+highestNum)
                    array[i] = finalString;


                }
               
                $("."+className+i).html(array[i])
              

        }
            }
            
        needsUpdating = [true,true,true,true]
        //updating objectives if they have changed
        
        if(needsUpdating[0] == true){
            model.objectiveDescriptions= newObjectiveDescriptions
            updateSpan("description",model.objectiveDescriptions,newObjectiveSyntax)
        }
        if(needsUpdating[1] == true){
            model.objectiveProgresses = newObjectiveProgresses
            updateSpan("progress",model.objectiveProgresses,newObjectiveSyntax)
        }
        if(needsUpdating[2] == true){
            model.objectiveNeeded = newObjectiveNeeded
            updateSpan("needed",model.objectiveNeeded,newObjectiveSyntax)
        }
        if(needsUpdating[3] == true){
            model.objectiveResults = newObjectiveResults
            updateSpan("result",model.objectiveResults,newObjectiveSyntax)
        }
        
    }
        
     };
    })();

    //adds the author and scenario name to the ui
    handlers.scenarioDetails = function(payload) {
   
        $(".author").html(payload[0])
        $(".scenarioName").html(payload[1]+" by ")


    }

    //updates the ingame clock on the scenario ui
    handlers.scenarioTime = function(payload) {

        var displayedMinutesSinceLanding = Math.floor(payload/60)
        var displayedSecondsSinceLanding = Math.round(payload%60);
        if(displayedSecondsSinceLanding < 10){displayedSecondsSinceLanding =  "0"+displayedSecondsSinceLanding}
       
        $(".landingTime").html(displayedMinutesSinceLanding+":"+displayedSecondsSinceLanding)
        
    }

    handlers.scenarioWave = function(payload) {
     
        
        var displayedSecondsSinceLanding = payload.waveInterval - Math.round(payload.elapsedTime%payload.waveInterval);

        //only affects wave mode and commented out sections not working with changing wave times
        
        // if(model.waveTime == null){model.waveTime = payload.waveInterval}
        // if(model.waveTime>payload.waveInterval){model.waveTime = payload.waveInterval}
        console.log(model.waveTime)
        console.log(model.waveInterval,"|")
        //if(model.waveTime<payload.waveInterval){return} 
       
        if(displayedSecondsSinceLanding < 10){displayedSecondsSinceLanding =  "0"+displayedSecondsSinceLanding}
        $(".waveTime").html(displayedSecondsSinceLanding)
       
        
    }