/*
This will contain all the functions that each trigger type uses.

currently it is all under triggerFunctions but may be split by purpose later.

*/


model.triggerFunctions = {};
//Planet, id, command, playerIndex,template, targetId
model.triggerFunctions["spawn_preset"] = function(avatarId,playerIndex,preset){
    

    console.log("attempting spawn preset trigger")
    model.executeAsPlayer(playerIndex,api.build_preset.exactPreFab,[avatarId,preset,playerIndex])
    //api.build_preset.exactPreFab(avatarId,preset,playerIndex)



}




//the below was an api but I prefer having these functions in core as they mainly use api rather than making it up.
    //     api.trigger = {
    
    //         buildPreset: function(){},
    
    //         spawnAvatar: function(){},
    
    //         spawnPuppet: function(){},
    
    //         spawnEffect: function(){},
    
    //         spawnVision: function(){},
    
    //         deleteUnitType: function(){},
    
    //         spawnCache: function(){},
    
    //         panToLocation: function(){},
    
    //         jumpToLocation: function(){},
    
    //         playAudio: function(){},
    
    
    
    
    //     }
    // }
    
    // init_trigger(window.api);

