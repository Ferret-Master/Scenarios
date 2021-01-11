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

    $("<script src='coui://ui/mods/scenario-ui/objective_ui_live_game.js' type='text/javascript'></script>").appendTo(document.body)
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
            var result = objective.visible;
            var description = objective.description;
            var needed = objective.needed;
            var progress = objective.progress;
            
            if(objective === undefined || visible === undefined || result === undefined || description === undefined || needed === undefined || progress === undefined){console.log("one of these was undefined"+" | "+objective+" | "+visible+" | "+result+" | "+description+" | "+needed+" | "+progress)}
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
            
            for(var i = 0;i<array.length;i++){
                //console.log(className+ " | "+i+" | "+array[i])
                $("."+className+i).innerHTML = array[i];
        }
            }
            

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
            updateSpan("results",model.objectiveResults)
        }
        
    }
        
     };
    })();