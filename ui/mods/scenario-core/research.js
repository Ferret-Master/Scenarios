/**
 * This file controls locking/unlocking units even when a scenario is not picked
 */

//hardcoded locks, research packs can add to this by appending to it, units that have been locked will be removed, ensures units stay locked on resets

model.unitsToLock = ["/pa/units/land/research_station/basic_research/armored_bomber/armored_bomber.json"];

//tracks locked units
model.lockedUnits = [];

//hardcoded pairs, can be added to by research packs by appending, format is [[researchfactoryunit,unittounlock],[]]
model.unlockPairs = [["/pa/units/land/research_station/basic_research/armored_bomber/armored_bomber_unlock.json","/pa/units/land/research_station/basic_research/armored_bomber/armored_bomber.json",["/pa/units/air/bomber/bomber.json","/pa/units/land/research_station/basic_research/armored_bomber/armored_bomber_unlock.json"]]]
researchLoop = function(){

    model.unitsToLock.forEach(function(unit){
       
        api.Panel.message("build_bar", 'lockUnit',unit)
        model.lockedUnits.push(unit)

    })
    model.unitsToLock = []
    if(model.lockedUnits.length>0){
        var armyPromise = model.allPlayerArmy(model.armyIndex())
        
        armyPromise.then(function(result){

            var armyKeys = _.keys(result)
        
            model.unlockPairs.forEach(function(pair){

                if(_.contains(model.lockedUnits,pair[1])){//if the pair is not already unlocked
                  
                 
                    if(_.contains(armyKeys,pair[0])){//unlock unit exists so unit should be unlocked
                  
                        var armyDataPromise = api.getWorldView(0).getUnitState(result[pair[0]])
                        armyDataPromise.then(function(result){
                       
                        if(result[0].built_frac == undefined){

                        api.Panel.message("build_bar", 'unlockUnit',pair[1])
                        if(pair[2] !== undefined){
                            pair[2].forEach(function(unit){
                                api.Panel.message("build_bar", 'lockUnit',unit)
                                model.lockedUnits.push(unit)
                            })

                        }

                        for(var i = 0;i<model.lockedUnits.length;i++){
                           // console.log(lockedUnits[i],pair[1])
                            if(model.lockedUnits[i] == pair[1]){
                                model.lockedUnits.splice(i,1)
                            }
                        }

                        }
                        })
                        
                    }
                    
                }
        
            })

        })
        
    }
    

    _.delay(researchLoop,1000)

}



_.delay(researchLoop,1000)