/**
 * This file is for the functions that allow live editing of the build bar/available units with the intent of allowing research to be a mechanic
 * 
 * model.buildSet().units contains the unit list I need to edit
 */


 model.oldUnits = []

 model.newUnits = []

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
  
    var tabs = model.buildSet().tabs()
    for(var i = 0;i<tabs.length;i++){
        var tab = tabs[i].items();
        for(var j = 0; j<tab.length;j++){
            var row = tab[j];
            for(var k = 0;k<row.length;k++){
                var slot = row[k];
                for(var nameIndex = 0;nameIndex < originalNames.length;nameIndex++){
                 
                    if(slot.id == originalNames[nameIndex]){
                        
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
        model.setupReplaceCount([originalNames[i],replacementNames[i]])
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

var tempfunction = function(selection)//shadowing the selection function to fake unit counts
{
 
    var curSpecs = model.buildSet().selectedSpecs();
    var removeSpecs = _.clone(curSpecs);
    var addSpecs = {};

    // Calculate the spec delta
    _.forIn(selection.spec_ids, function(count, id)
    {
        if (removeSpecs[id] || curSpecs[id])
        {
            delete removeSpecs[id];
            return;
        }

        if (model.buildSet().buildLists[id])
            addSpecs[id] = model.buildSet().buildLists[id];
    });

    var addEmpty = _.isEmpty(addSpecs);
    var removeEmpty = _.isEmpty(removeSpecs);
    if (!addEmpty || !removeEmpty)
    {
        if (!removeEmpty)
        {
            _.forIn(removeSpecs, function(build, id)
            {
                delete curSpecs[id];
            });
        }
        if (!addEmpty)
        {
            _.assign(curSpecs, addSpecs);
        }
        model.buildSet().selectedSpecs.notifySubscribers(curSpecs);
    }

    // Update counts
    var buildItems = model.buildSet().buildItems();
    var clears = _.transform(buildItems, function(result, item, id) { result[id] = item.count(); });
    _.forIn(selection.build_orders, function(count, id)
    {
        if (count)
            delete clears[id];
        if (buildItems[id])
            buildItems[id].count(count);
    });
    _.forIn(clears, function(value, id)
    {
        if (value)
            buildItems[id].count(0);
    });

    for(key in selection.build_orders){// if a new unit is queued is adds the count to the old unit to update the ui
        var unit = key
     
        for(var i = 0;i<model.newUnits.length;i++){
           
            if(unit == model.newUnits[i]){
          
                var newUnitCount = selection.build_orders[model.newUnits[i]]
                

                var oldUnit =  model.oldUnits[i];
            
       
                model.buildSet().buildItems()[oldUnit].count(newUnitCount)
               
            }
        }

    }
};

model.setupReplaceCount = function(unitPair){
    for(var i = 0;i<model.oldUnits.length;i++){
        if(unitPair[0] == model.oldUnits[i]){
            model.newUnits[i] = unitPair[1];
            return;
        }
    }
    model.oldUnits.push(unitPair[0])
    model.newUnits.push(unitPair[1])
}

var delayedAssign = function(){
    model.buildSet().parseSelection = tempfunction;
}

_.delay(delayedAssign,5000)