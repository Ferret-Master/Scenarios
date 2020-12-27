
/*
this file will be what controls and keeps track of objectives within a scenario

Objectives will be defined as

Type, Location, Radius, Unit, Amount

if not needed just leave with "", unspecified amount for destroy enemy units in radius will be destroy all units there.


objective types(early):

- Build unit at location
- Move unit to location
- Control Location for x time
- Destroy enemy units at location
- Survive
- Build x
- Gather x resource
- Description/dialogue

*/


function ObjectiveViewModel() {

    var playerId = null;

    var self = this;

    self.allObjectives = ko.observable([]);

    self.activeObjectives = ko.observable([]);//an active objective may be hidden and should not show in ui if that is the case.

    self.finishedObjectives = ko.observable([]);

    self.scenarioComplete = ko.observable(false); //if true display a ending message or trigger something??

}

var objectiveModel = new ObjectiveViewModel();

var totalObjectives = 0;
/* 
This function takes in the objectives list and assigns them to all objectives and active objectives if they have a active at beginning tag.
*/

//checking for fnished scenario removed as it should be done via a trigger.

/* 
This function takes in an objective and activates the appropriate function from objective_functions.js which will check and return progress. progress will be stored in the objective object.

many of the objective checking functions will be async so this is as well

returns true if objective is complete, returns progress if it is part of it. returns false is the objective is failed.
*/
function objectiveProgress(objectiveObject,playerId){

if(objectiveObject == "empty"){return null}

var returnPromise = new Promise(result) = function(){return model.objectiveFunctions[objectiveObject.type](objectiveObject,playerId);}

var returnArray = [objectiveObject, returnPromise]
return returnArray;
    
}
/*

this needs it's own function due to the visual nature of some objectives.

e.g getting units in an area or king of the hill needs to show that area. 

also triggers the needed ui components.

*/

model.makeObjectiveActive = function(objectiveObject){ 

    objectiveModel.activeObjectives.push(objectiveObject);



}
model.setupObjectives = function(objectiveArray){
    
    objectiveModel.playerId = 0;//temp

    for(var i = 0;i<objectivesArray.length;i++){//converts shorthand values to easier to use ones

        if(objectiveArray[i].unitType !== undefined){objectiveArray[i] = model.fullUnitName(objectiveArray[i].unitType)}

    }
    //hopefully none of this ends up being async


    for(var i = 0;i<objectivesArray.length;i++){


        objectiveModel.allObjectives[i] = objectiveArray[i];
        if(objectiveArray[i].startingObjective == true){
            
            makeObjectiveActive(objectiveArray[i])
        }

        totalObjectives++;
    }

model.objectiveLoop;
}

model.objectiveLoop = function(){
    console.log("objective loop running")
    
    if(objectiveModel){//if the model is defined
        var active = objectiveModel.activeObjectives;
        for(var i = 0;i<active.length;i++){
            

            objectiveProgress(active[i]).then(function(result){

                if(result[1] == null){continue}
                if(result[1] == true){//move from active objectives into finished, update ui, activate success triggers

                    objectiveModel.finishedObjectives.push(result[0])
                    objectiveModel.activeObjectives = objectiveModel.activeObjectives.filter(function(item) {
                        return item !== value
                    })
                    for(var j = 0;j<result[0].successTriggers;j++){

                        model.activateTrigger(result[0].successTriggers[j]);

                    }

                }
                else if(result[1] == false){//move from active to finished, update ui, activate failure triggers. 

                    objectiveModel.finishedObjectives.push(result[0])
                    objectiveModel.activeObjectives = objectiveModel.activeObjectives.filter(function(item) {
                        return item !== value
                    })

                }
                else{//other result should be an update to progress, so update ui



                }
                
                
                })

        }




    }

    if(model.gameOver !== true){

        setTimeout(model.objectiveLoop,1000);

    }
}



// handlers.setupObjectives = function(payload) {

//     console.log("setup Objectives called with "+ payload)
//     objectiveModel.allObjectives = payload;
    
// };