(function() {

function createScenarioFrame() {
    if(model.alreadyMadeFrame == false){
    console.log("running make frame")
    createFloatingFrame("scenario_frame", 400, 250, { "snap": false, "top": 42, "rememberPosition": "false" });//this top offset is so player bar with eco mods doesn't overlap


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
handlers.objectiveUpdate = function(payload) {
    if(model.alreadyMadeFrame === undefined){model.alreadyMadeFrame = false;}
    if(model.alreadyMadeFrame == false){createScenarioFrame();model.alreadyMadeFrame = true}
        if(payload === undefined || payload === 0 ){addLinkageLiveGame("model.objectiveModel()", "model.objectiveViewModel");console.log("active undefined");return} 
    else{
       
        var newObjectiveDescriptions = [];
        var newObjectiveProgresses = [];
        var newObjectiveNeeded = [];
        var newObjectiveResults =[];
        for(var i = 0;i<payload.length;i++){
           
            var objective = payload[i];
            var visible = objective.visible;
            var result = objective.result;
            var description = objective.description;
            var needed = objective.needed;
            var progress = objective.progress;
            
            if(objective === undefined || visible === undefined || result === undefined || description === undefined || needed === undefined || progress === undefined){;}
            else{
                newObjectiveDescriptions.push(description)
                newObjectiveProgresses.push(progress)
                newObjectiveResults.push(result)
                newObjectiveNeeded.push(needed)
            }
        }
        
        var realCheckArray = [model.objectiveDescriptions,model.objectiveProgresses,model.objectiveNeeded,model.objectiveResults]
        var updateCheckArray = [newObjectiveDescriptions,newObjectiveProgresses,newObjectiveNeeded,newObjectiveResults]
        var needsUpdating = []
      
        for(var i = 0;i<4;i++){
            var tempCheck = updateCheckArray[i];
            var tempReal = realCheckArray[i];
        
           
            if(tempCheck.length == tempReal.length){

                for(var j = 0;j<tempCheck.length;j++){
                    if(tempCheck[j] !== realCheckArray[j]){needsUpdating[i] = true}

                }

            }
            
            else{needsUpdating[i] = true}

        }
        
        function updateSpan (className, array){
            if(array.length <4){for(var i = array.length;i<4;i++){array[i] = " "}}
            for(var i = 0;i<array.length;i++){
                
                
                $("."+className+i).html(array[i])
              

        }
            }
            
        needsUpdating = [true,true,true,true]
        //updating objectives if they have changed
        if(needsUpdating[0] == true){
            model.objectiveDescriptions= newObjectiveDescriptions
            updateSpan("description",model.objectiveDescriptions)
        }
        if(needsUpdating[1] == true){
            model.objectiveProgresses = newObjectiveProgresses
            updateSpan("progress",model.objectiveProgresses)
        }
        if(needsUpdating[2] == true){
            model.objectiveNeeded = newObjectiveNeeded
            updateSpan("needed",model.objectiveNeeded)
        }
        if(needsUpdating[3] == true){
            model.objectiveResults = newObjectiveResults
            updateSpan("result",model.objectiveResults)
        }
        
    }
        
     };
    })();

    //adds the author and scenario name to the ui
    handlers.scenarioDetails = function(payload) {
        console.log(payload)
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