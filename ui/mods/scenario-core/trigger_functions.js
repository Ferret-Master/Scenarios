/*
This will contain all the functions that each trigger type uses.

currently it is all under triggerFunctions but may be split by purpose later.

*/


model.triggerFunctions = {};
//Planet, id, command, playerIndex,template, targetId
model.triggerFunctions["preset"] = function(triggerObject){
    
    var avatarId = model.scenarioModel["avatarId"];
    console.log("avatarId: "+avatarId)
    
    if(avatarId == undefined || avatarId == -1){_.delay(model.triggerFunctions["preset"],1000,triggerObject);return}
    if(triggerObject["delay"]>0){var newTriggerObject = triggerObject;newTriggerObject.delay = 0 ;_.delay(model.triggerFunctions["preset"],(triggerObject["delay"]*1000),triggerObject)}
    playerIndex = model.armyIndex();
    console.log("triggerObject:"+JSON.stringify(triggerObject))
    var preset = triggerObject.prefab;
    console.log("prefab:"+JSON.stringify(preset))
    console.log("attempting spawn preset trigger")
    model.executeAsPlayer(playerIndex,api.build_preset.exactPreFab,[avatarId[0],preset])
    //api.build_preset.exactPreFab(avatarId,preset,playerIndex)



}

model.triggerFunctions["dynamic_preset"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["spawn_supply"] = function(triggerObject){
   
    return;

}

model.triggerFunctions["vision"] = function(triggerObject){
   
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

