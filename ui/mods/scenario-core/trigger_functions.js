/*
This will contain all the functions that each trigger type uses.

currently it is all under triggerFunctions but may be split by purpose later.

*/





model.triggerFunctions = {};
//Planet, id, command, playerIndex,template, targetId
model.triggerFunctions["paste_unit"] = function(triggerObject){
    api.Panel.message("devmode","spawnUnit",triggerObject.unit);
}

model.triggerFunctions["load_commander"] = function(triggerObject){
    var transportIdPromise =  model.playerArmy(model.armyIndex(), 0,"/pa/units/air/scenario_loader/scenario_loader.json" ,false)
    transportIdPromise.then(function(result){
        
       
        for(property in result){result = result[property]}

        if(result === undefined || model.scenarioModel.playerCommanderId === undefined){_.delay(model.triggerFunctions["load_commander"],1000,triggerObject);return}
     
        for(var i = 0;i<model.scenarioModel.playerCommanderId.length;i++){
       
            if(model.scenarioModel.playerCommanderId[i] === undefined || result[i] === undefined){_.delay(model.triggerFunctions["load_commander"],1000,triggerObject);return}
         
            api.getWorldView(0).sendOrder({units: result[i],command: 'load',location: {planet: triggerObject.planet,entity: model.scenarioModel.playerCommanderId[i]},queue: true,group:true});

        }
        

    })
}

model.triggerFunctions["preset"] = function(triggerObject){
    
    var avatarId = model.scenarioModel["avatarId"];
 
    if(avatarId == undefined || avatarId == -1){_.delay(model.triggerFunctions["preset"],1000,triggerObject);return}
    if(triggerObject["delay"]>0){var newTriggerObject = triggerObject;newTriggerObject.delay = 0 ;_.delay(model.triggerFunctions["preset"],(triggerObject["delay"]*1000),triggerObject)}
    playerIndex = model.armyIndex();

    var preset = triggerObject.prefab;
    console.log(playerIndex)
    console.log("running build preset")
    model.executeAsPlayer(playerIndex,api.build_preset.exactPreFab,[avatarId[0],preset])
    //api.build_preset.exactPreFab(avatarId,preset,playerIndex)



}

model.triggerFunctions["preset_unit"] = function(triggerObject){//different version as units
    
    var avatarId = model.scenarioModel["avatarId"];
 
    if(avatarId == undefined || avatarId == -1){_.delay(model.triggerFunctions["preset_unit"],1000,triggerObject);return}
    if(triggerObject["delay"]>0){var newTriggerObject = triggerObject;newTriggerObject.delay = 0 ;_.delay(model.triggerFunctions["preset_unit"],(triggerObject["delay"]*1000),triggerObject)}
    playerIndex = model.armyIndex();

    var preset = triggerObject.prefab;
 
    model.executeAsPlayer(playerIndex,api.build_preset.exactPreFabUnit,[avatarId[0],preset])
    //api.build_preset.exactPreFab(avatarId,preset,playerIndex)



}

// this function will build the unitToBuild at the location of every unit specified by existing unit. useful when you want player control over a build location, recomended to only use with units rather than structures.
// might need to modify to allow for it to build all the units but if re ran not repeat it for already done ones(so only affect new spots)
// neat way to allow unit spawning at captured locations more easily
// main reason for use is replacing commander currently, may be more work than needed if I only use it for that.
/*{"name": "spawn_replacement",
"id": 3,
"type": "build_at_existing_unit",
"special":"playerCom"}
*/
model.triggerFunctions["build_at_existing_unit"] = function(triggerObject){
    console.log("builda at existing unit running")
    var avatarId = model.scenarioModel["avatarId"];
 
    if(avatarId == undefined || avatarId == -1){_.delay(model.triggerFunctions["build_at_existing_unit"],1000,triggerObject);return}
    if(triggerObject["delay"]>0){var newTriggerObject = triggerObject;newTriggerObject.delay = 0 ;_.delay(model.triggerFunctions["build_at_existing_unit"],(triggerObject["delay"]*1000),triggerObject)}
    playerIndex = model.armyIndex();
    var buildLocation;
    var planet;
    var unitToBuild;
    triggerObject.prefab = {};
    if(triggerObject.special == "playerCom"){
        console.log(model.scenarioModel.playerCommanderType)
        console.log(model.scenarioModel.playerSpawn.chosenPos)
        console.log(model.scenarioModel.playerSpawn.chosenPlanet)
        if(model.scenarioModel.playerCommanderType == undefined || model.scenarioModel.playerSpawn.chosenPos == undefined || model.scenarioModel.playerSpawn.chosenPlanet === undefined){_.delay(model.triggerFunctions["build_at_existing_unit"],1000,triggerObject);return}
        triggerObject.prefab.units = [{"unitType":model.scenarioModel.playerCommanderType,"pos":model.scenarioModel.playerSpawn.chosenPos,"orientation": [0, 0, 0 ]}]
        triggerObject.prefab.planet = model.scenarioModel.playerSpawn.chosenPlanet
        
     
    }
    else{// TODO expand for general use

        var unitToBuild = triggerObject.unitName;
        var unitToBuildAt = triggerObject.existing_unit;
    }
    console.log("sending build order ")
    console.log(triggerObject)
    var preset = triggerObject.prefab;
    console.log(preset)
    console.log(avatarId)
    model.executeAsPlayer(playerIndex,api.build_preset.exactPreFabUnit,[avatarId[0],preset])
    //api.build_preset.exactPreFab(avatarId,preset,playerIndex)



}

model.triggerFunctions["wipe_planet"] = function(triggerObject){//spawns a unit in on the focussed planet that destroys every enemy unit on it, wipe system varient would move it to each planet.

       
    console.log("tried to wipe planet")
    var planet = model.currentFocusPlanetId();
    if(planet <0){_.delay(model.triggerFunctions["wipe_planet"],1000,triggerObject);return}

    var wipe_planet = "/pa/units/land/world_wipe/world_wipe.json";

    engine.call('unit.debug.setScenarioSpecId',wipe_planet);
    engine.call('unit.debug.scenarioPaste')
       

    return;

}

//spawning vision is similar to prefabs but does not have to be as exact or include the unit name, I should probably return the id of the vision for later removal if needed
//vision will have duration and three size presets(for now)

model.triggerFunctions["vision_medium"] = function(triggerObject){ 
  

    //will return id's later but need a way to track specific unit id's in game to destroy etc if the duration is forever. e.g vision dissapears after an objective is completed, but only one set.
    //assignjing name/id to each vision trigger to a new thing in objective model could work. then can delete them with triggers given their name/id
    var avatarId = model.scenarioModel["avatarId"];
 
    if(avatarId == undefined || avatarId == -1){_.delay(model.triggerFunctions["vision_medium"],1000,triggerObject);return}
    if(triggerObject["delay"]>0){var newTriggerObject = triggerObject;newTriggerObject.delay = 0 ;_.delay(model.triggerFunctions["preset_unit"],(triggerObject["delay"]*1000),triggerObject)}
    playerIndex = model.armyIndex();

    var locations = triggerObject.location;
    console.log("locations: "+locations)
    console.log(playerIndex)
    console.log("running vision medium")
    for(var i = 0;i<locations.length;i++){
        var location = locations[i];
        var preset = {

            planet:location.planet,
            units:[
                {
                    unitType:"/pa/units/orbital/vision_two/vision_two.json",
                    pos: location.pos,
                    orientation:[0,0,0]
                }
            ]




        }
        model.executeAsPlayer(playerIndex,api.build_preset.exactPreFabUnit,[avatarId[0],preset])
    }
    return;

}


model.triggerFunctions["vision_small"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["vision_large"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["dynamic_preset"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["spawn_supply"] = function(triggerObject){
   
    return;

}



model.triggerFunctions["radar"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["destroy_unit"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["repair"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["destroy_enemy_unit"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["clear_trees"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["spawn_puppet"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["play_audio"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["play_video"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["show_image"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["move_camera"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["save_selection"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["save_camera"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["select_unit"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["spawn_effect"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["prevent_unit_selection"] = function(triggerObject){//prevents the selection of a particular unit
    model.scenarioModel.noSelection.push(triggerObject.unitJSON)
    return;

}




//the below was an api but I prefer having these functions in core as they mainly use api rather than making it up.
    //     api.trigger = {
    
    //         Preset: function(){},
    
    //         spawnPuppet: function(){},

    //         spawnPuppetWithEffect: function(){},
    
    //         spawnEffect: function(){},
    
    //         spawnVision: function(){},

    //         spawnRadar: function(){},
    
    //         deleteUnitType: function(){},
    
    //         spawnCache: function(){},
    
    //         panToLocation: function(){},
    
    //         jumpToLocation: function(){},
    
    //         playAudio: function(){},
    
    
    
    
    //     }
    // }
    
    // init_trigger(window.api);

