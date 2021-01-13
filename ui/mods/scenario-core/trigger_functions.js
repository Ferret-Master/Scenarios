/*
This will contain all the functions that each trigger type uses.

currently it is all under triggerFunctions but may be split by purpose later.

*/





model.triggerFunctions = {};
//Planet, id, command, playerIndex,template, targetId
model.triggerFunctions["preset"] = function(triggerObject){
    
    var avatarId = model.scenarioModel["avatarId"];
 
    if(avatarId == undefined || avatarId == -1){_.delay(model.triggerFunctions["preset"],1000,triggerObject);return}
    if(triggerObject["delay"]>0){var newTriggerObject = triggerObject;newTriggerObject.delay = 0 ;_.delay(model.triggerFunctions["preset"],(triggerObject["delay"]*1000),triggerObject)}
    playerIndex = model.armyIndex();

    var preset = triggerObject.prefab;
 
    model.executeAsPlayer(playerIndex,api.build_preset.exactPreFab,[avatarId[0],preset])
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
    if(triggerObject["delay"]>0){var newTriggerObject = triggerObject;newTriggerObject.delay = 0 ;_.delay(model.triggerFunctions["preset"],(triggerObject["delay"]*1000),triggerObject)}
    playerIndex = model.armyIndex();

    var locations = triggerObject.location;
    console.log("locations: "+locations)
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
        model.executeAsPlayer(playerIndex,api.build_preset.exactPreFab,[avatarId[0],preset])
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

