/*

this file contains all the functions that will  be called for checking and displaying objectives

the top half will be objectiveCheckFunctions that check the progress/fulfillment of an objective.

the bottom half are objectiveEffect functions and are ran when an objective becomes active. They are essentially built in triggers for each objective so that the scenario objectives don't require a bunch of starting triggers.

it is possible I will switch to them in future though.

e.g units in area will need an effect circle to signify the area.

*/



model.objectiveCheckFunctions = {};

model.objectiveEffectFunctions = {};

/*
------------------------------------------- [Objective Checks] -------------------------------------------
*/


/*
returns the number of units in an area.
basis for other area functions such as grabbing the types or id's of units in an area.

TODO needs array checks, same applys to functions it is calling.
*/


model.objectiveCheckFunctions["timed"] = function (timedObject){

    if(timedObject.activationTime == undefined && model.scenarioModel.fullTime !== 0){

        timedObject.activationTime = model.scenarioModel.fullTime
    }
    
    if((model.scenarioModel.fullTime - timedObject.activationTime)>timedObject.time){console.log("timed objective finished");return true}

}

model.objectiveCheckFunctions["gather"] = function (timedObject){//ammassing a certain amount of metal/power

    return;

}

model.objectiveCheckFunctions["survive_time"] = function (timedObject){

    return;

}

model.objectiveCheckFunctions["build_units"] = function (timedObject){

    return;

}

model.objectiveCheckFunctions["destroy_units"] = function (timedObject){//likely in area tracking id's is annoying

    return;

}


/**
 this function checks an arae for every players units and depending on settings will return who controls it, progress will be tracked by adding time whenever checked.


 it should return true if the player has controlled for needed time, otherwise increment the progress array for the player in control(this is annoying and will require seperate ui)
 */
model.objectiveCheckFunctions["control_area"] = function (objectiveObject, playerId){


    //for each player get the units within an area, if only 1 player has units within the area they get their time incremented
    for(var i = 0;i<objectiveObject.progress.length;i++){if(objectiveObject.progress[i]>=objectiveObject.needed && i == model.armyIndex()){return true}}
    var unitCount = objectiveObject.needed;
    var areaLocation = objectiveObject.location; // planet, center coordinates, and radius
    var allPlayerIds = model.scenarioModel.playerArray;
    for(var i = 0;i<allPlayerIds.length;i++){if(objectiveObject.progress[i] === undefined){objectiveObject.progress[i] = 0}}
    var promiseArray = [];
    for(var i = 0;i<allPlayerIds.length;i++){

        var armyPromise = model.playerArmy(allPlayerIds[i], areaLocation[0].planet, "", true)

       promiseArray.push(armyPromise.then(function (playerArmy) {

        var radiusPromise = new Promise(function (resolve, reject) { resolve(model.countArmyInRadius(playerArmy, areaLocation[0])); })

           return radiusPromise.then(function (units) {

                if (_.isArray(units)) {
                    if (units.length >= unitCount) { return true }
                
                    return units.length;

                }
                else {
                
                    if (units >= unitCount) { return true }
                    else { return units }


                }
            }).catch(function (err) { console.log(err) });
   
        }).catch(function (err) { console.log(err) }))

       
    }
    var returnVar = Promise.all(promiseArray)
    
   
    return returnVar.then(function(armyArray){

        //checks if a singular army controls the area, if so returns a new progress array
        //likely I will need to return player id's with the army functions to match the promise up
        
        var singleArmy = 0;
        for(var i = 0;i<allPlayerIds.length;i++){
            var unitCount = armyArray[i];
            if(unitCount>(0+objectiveObject.dont_count)){singleArmy++}
           
        }
        
        //return updated control array
        if(singleArmy === 1){

            for(var i = 0;i<armyArray.length;i++){

                if(armyArray[i] > (0+objectiveObject.dont_count)){objectiveObject.progress[i]+=1;return objectiveObject.progress}
            }

        }
    })
   
   

}


/**
 this function checks what units are within a defined area and depending on the objective will return whether they meet criteria

 */
model.objectiveCheckFunctions["units_in_area"] = function (objectiveObject, playerId) {

    var unitCount = objectiveObject.needed;
    var areaLocation = objectiveObject.location; // planet, center coordinates, and radius
    var unitType = objectiveObject.unitType; //the units file name
    var specificUnit = objectiveObject.specificUnit;
    var specificUnitId = objectiveObject.specificUnitId;
    if (unitType == undefined) { unitType = "" }

    //needs to be expanded for this to be useful
    if (specificUnit == true) { //currently only checks 1 id
        model.unitsInRadius(playerId, unitType, areaLocation).then(function (units) {
            if (_.contains(units, specificUnitId)) { return true }
            return 0;
        });

    }

    else {

        var armyPromise = model.playerArmy(playerId, areaLocation[0].planet, unitType, true)

        return armyPromise.then(function (playerArmy) {

            var radiusPromise = new Promise(function (resolve, reject) { resolve(model.countArmyInRadius(playerArmy, areaLocation[0])); })

           return radiusPromise.then(function (units) {

                if (_.isArray(units)) {
                    if (units.length >= unitCount) { return true }
                    return units.length;

                }
                else {

                    if (units >= unitCount) { return true }
                    else { return units }


                }
            }).catch(function (err) { console.log(err) });
   
        }).catch(function (err) { console.log(err) })


    }

}

/*
------------------------------------------- [Objective Effects] -------------------------------------------

these are activated when objectives move to active and removed when the objective is finished
*/




/*
spawns a colored ring at a chosen location with a size roughly equal to the circle made by the given radius.
*/
model.objectiveEffectFunctions["radius_ring"] = function (objectLocation, duration) {

    
    var location = {};
    location.planet = objectLocation[0].planet;
    location.pos = objectLocation[0].pos;
    location.radius = objectLocation[0].radius;
    //given location is planet and position
    
    console.log(JSON.stringify(location)+" | "+duration)
    

    /*
     spawn puppeteted ring effect at location for duration. if duration not specified set to not delete

     returns puppetid so it can be deleted if objective is completed.

     size is calculated and changed via scale
      
      
     */


    //edit location to contain needed scale
    
    location.scale = location.radius/6;
    //location.scale = 1;
    delete location.radius;
    
    var effectPromise = api.puppet.createEffect("pingRed",location,duration,true);

    return effectPromise;


}






