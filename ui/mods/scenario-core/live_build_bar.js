/**
 * This file is for the functions that allow live editing of the build bar/available units with the intent of allowing research to be a mechanic
 * 
 * model.buildSet().units contains the unit list I need to edit
 */


var lockedUnits = []

model.lockUnit = function(unitName){//units are locked by adding _disabled to the end of the id

    var units = model.buildSet().units
    if(units[unitName] !== undefined){
        var unitId = units[unitName].id 
        if(unitId.endsWith("_disabled")){return}
        units[unitName].id = unitId + "_disabled"
    
    }

}

model.unlockUnit = function(unitName){//units are unlocked by removing the _disabled for units that otherwise match the id

    var units = model.buildSet().units
    if(units[unitName] !== undefined){
        var unitId = units[unitName].id 
        if(unitId.endsWith("_disabled")){
            units[unitName].id = unitName
        }
        else{return}
       
    
    }
}


handlers.lockUnit = function(payload){
    console.log("locking unit"+payload)
    model.lockUnit(payload)
}


handlers.unlockUnit = function(payload){
    console.log("unlocking unit"+payload)
    model.unlockUnit(payload)
}