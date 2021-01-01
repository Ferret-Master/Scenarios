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

