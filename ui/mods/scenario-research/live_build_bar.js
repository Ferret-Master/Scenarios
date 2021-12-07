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
//model.buildSet().tabs()[0].items()[0][0]

//goes tabs -> ITEMS/ROWS -> slots , check via id
//loop through each of these and replace any id's/buildbar icons that need replacing

//takes in array of units to replace and what to replace them with
model.replaceUnit = function(originalNames, replacementNames){
    console.log(originalNames)
    console.log(" new line ")
    console.log(replacementNames)
    var tabs = model.buildSet().tabs()
    for(var i = 0;i<tabs.length;i++){
        var tab = tabs[i].items();
        for(var j = 0; j<tab.length;j++){
            var row = tab[j];
            for(var k = 0;k<row.length;k++){
                var slot = row[k];
                for(var nameIndex = 0;nameIndex < originalNames.length;nameIndex++){
                    console.log(slot, " | " ,originalNames[nameIndex])
                    if(slot.id == originalNames[nameIndex]){
                        console.log("replacing ",slot.id ," with ",replacementNames[nameIndex])
                        model.buildSet().tabs()[i].items()[j][k].id =  replacementNames[nameIndex]
                        // var buildbarReplacement = replacementNames[nameIndex].replace('.json','_icon_buildbar.png')
                        // model.buildSet.tabs()[i].items()[j][k].buildIcon(buildbarReplacement)
                    }
                }
            }
        }
    }

    for(var i = 0; i< originalNames.length;i++){
        api.Panel.message(api.Panel.parentId,'replaceHotkey',[originalNames[i],replacementNames[i]]);
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

handlers.replaceUnit = function(payload){
    console.log("replacing units"+payload)
    model.replaceUnit(payload[0],payload[1])
}