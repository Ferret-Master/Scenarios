
//valid spawns(not in cssg/water/lava)
function filterValidpoints(pointArray){


}


function generatePlanetPoints(r){
    //spawn point generation, need a large initial amount generated so that there is not major structure stacking
    model.generateRandomPoints(r, 1000)

}

//valid spawns(not in cssg/water/lava)

//valid spawns in area(spawns appear in bounded area centered on point)

//valid spawn in any point array band(used for control towers/creep spawning), can chain this for upgraded spawning. if required is ticked will return 0 points if missing areas
function pointsInArrayBands(points,areaPoints,bandLower,bandHigher,required){
    if(bandLower == undefined){bandLower = 0}
    if(bandHigher == undefined){bandHigher = 2000}
    var returnArray = [];
    var tooClose = false;
    var closeEnough = false;
    if(areaPoints == undefined && required !== true){return points}
    if(areaPoints.length < 1 && required !== true){return points}
    points.forEach(
        function(point){
            tooClose = false;
            closeEnough = false;
            for(var locationIndex in areaPoints){
               
            var distance = model.distanceBetween(point, areaPoints[locationIndex])
            if(distance < bandLower){
                
                tooClose = true
               
            }
            else {

                if (distance < bandHigher) {closeEnough = true}
            }
            }
            if(tooClose == false && closeEnough == true){returnArray.push(point)}
          
    }
    )
 
    return returnArray;

    

}

function clearAndReplaceAtPosition(player, position, unit,planet){//spawns a unit that immediatly destroys whatever it is on then a few seconds later spawns the specified replacement unit
    model.spawnExact(player,"/pa/units/land/clear_position/clear_position.json",planet,position,[0,0,0]);
    _.delay(function(){model.spawnExact(player,unit,planet,position,[0,0,0])},3000)
}
//random valid spot function

//spawn bug


//spawn roaming bug



//spawns non objective map stuff
//includes things like reclaimable rocks, neutral units, supply caches



//scenario wave spawning, far too large for a single function and hard to cleanly add to

model.objectiveCheckFunctions["spawn_waves_copy"] = function (waveObject){
    if(model.paused() == true || model.isSpectator() == true || model.gameOver() == true || model.scenarioModel.landTime == 200000){return}
    if(model.serverRate() < 0.3){model.triggerFunctions["kill_all_invincible_ai"]({})}//kill switch if server has went to shit, requires ai to use the ai invincible com
    if(model.serverRate() < 0.25){model.triggerFunctions["wipe_planet"]({}) ;return}
    if(model.serverRate() < 0.6){return}//dont try and spawn a wave when the server is already slow
    
    var planetRadius = 500
    var planets = model.planetListState()

    planets = planets.planets
    for(planetIndex in planets){
     
        if(planets[planetIndex].id == waveObject.planet){planetRadius = planets[planetIndex].radius}
    }
  
    
    var army = []
    var controllingPlayer = 0;
    var playerController =false
    if(waveObject.playerType == "ai"){
        players = model.players()
        for(playerIndex in players){
            var player = players[playerIndex]
            if(player.ai == true && player.stateToPlayer == "hostile" && playerController == false){
                controllingPlayer = playerIndex
            }
            if(player.econ_rate == 0.1){

                controllingPlayer = playerIndex
                playerController = true
            }
            
            else{
                army.push(model.playerArmy(playerIndex,waveObject.planet,"",true,waveObject.dont_spawn_near_unit_type))
            }

        }

    }
    if(controllingPlayer == model.armyIndex()){return}
   
    var allArmy = Promise.all(army)
    var scalingRatio = 0
    allArmy.then(function(result){
        
        var locations = []
        for(armyIndex in result){
     
        for(unitIndex in result[armyIndex]){
            unit = result[armyIndex][unitIndex]
            if(unit !== undefined){if(unit == undefined){continue} locations.push(unit.pos)}
          
        }

         }

         function randomPoint(){
            var maxDist = waveObject.spawn_close_radius
            if(maxDist == undefined){maxDist = 2000}
            var posArray = rand_sphere_point(planetRadius)
            if(waveObject.dont_spawn_radius !== undefined){
               
                var tooClose = false
                var closeEnough = false
                for(var locationIndex in locations){
                   
                  
                var distance = model.distanceBetween(posArray, locations[locationIndex])
                if(distance < waveObject.dont_spawn_radius){
                    
                    tooClose = true
                   
                }
                else {

                    if (distance < maxDist) {closeEnough = true}
                }
                }
                if(tooClose == true || closeEnough == false){ return randomPoint()}
                else{return posArray}
            }
            }
        if(waveObject.planet !== undefined){//planet rather than location based wave spawning

            var effectNeeded = (waveObject.spawnEffect !== undefined)
          
            if((model.scenarioModel.RealTimeSinceLanding)%waveObject.waveInterval >0 && (model.scenarioModel.RealTimeSinceLanding%waveObject.waveInterval <2 && waveObject.timesCalled >0) && waveObject.lastCalled !==(model.scenarioModel.RealTimeSinceLanding)){//if it is time to spawn a wave
                waveObject.lastCalled;
                console.log("spawning wave with difficulty value of "+waveObject.progress)
           
                var waveUnits = _.keys(waveObject.unitValues)
                var groupSpawnPoint = randomPoint()
                var randomNum = Math.random()
                // if(effectNeeded == true && waveObject.effectContext == "groups"){
                 
                //     var effectJson = {
                //         effectName:"burrow",
                //         duration:waveObject.spawnEffectDuration,
                //         location: groupSpawnPoint
                //     }
                //     model.sendJsonMessage("spawnEffect",effectJson)
                // }

                //for each wave 
                var totalChance = 0
                var pickedWave = false;
               
                for(waveIndex in waveUnits){
                    if(pickedWave == true){continue}
                   
                    var waveChance = waveObject.unitValues[waveUnits[waveIndex]].waveChance
                    totalChance += waveChance
                   
                    if(randomNum<=totalChance){

                        waveUnits = waveObject.unitValues[waveUnits[waveIndex]]
                        pickedWave = true
                        
                    }
                }
               
                if(pickedWave == false){waveUnits = waveObject.unitValues[waveUnits[0]]}
                var unitsToBeSpawned = [];
                for(groupIndex in waveUnits){//for each unit group in the wave
                    if(groupIndex == "waveChance"){continue}
                   
                    var unitGroupObject = waveUnits[groupIndex]
                    var groupValue = waveObject.progress/unitGroupObject.value 
                    // console.log(groupValue)
                    // console.log(locations.length)
                    // console.log(waveObject.accelerate_value)
                    if(waveObject.accelerate_by_dont_spawn_type == true){groupValue = groupValue +( groupValue * locations.length*waveObject.accelerate_value/(model.players().length-1))}
                   //console.log(groupValue)
                  
                    for(unitIndex in unitGroupObject.units){// for each unit in the group
                        var unit = unitGroupObject.units[unitIndex]
                        var unitValue = unit[1]
                        var unitName = unit[0]
                        var unitScalingNumber = unit[2]
                        var unitRatio = unitScalingNumber/groupValue
                        
                        //if(unitGroupObject.units.length>1){unitRatio = unitRatio + (-0.1 * Math.pow((0.015*(groupValue/unitValue)),2)) + 0.004*groupValue}
                        if(unitRatio>1){unitRatio = 1}
                        if(unitRatio<0){unitRatio = 0}
                        
                        var unitsNeeded = unitRatio*groupValue/unitValue
                        unitsNeeded = Math.floor(unitsNeeded)
                      
                        console.log("spawning "+unitsNeeded+" "+unitName)


                        
                      
                        if(waveObject.spreadGroupSize == undefined){waveObject.spreadGroupSize = 0}
                        for(var points = 0; points<unitsNeeded;points++){// queuing up many random movement commands, move doesnt have the pausing of patrol
                            if(groupValue<0){ continue}
                            unitsToBeSpawned.push(unitName)
                            
                            groupValue -= unitValue
                             
                         }

                    }
         
                }

                var groupCounter = 0;
                unitsToBeSpawned = _.shuffle(unitsToBeSpawned);
                unitsToBeSpawned.forEach(function(unitName){

                    if(waveObject.group == false){
                        if(groupCounter == waveObject.spreadGroupSize){
                            groupSpawnPoint = randomPoint();
                            groupCounter = 0;
                        }
                        else{groupCounter += 1}
                    }
                    console.log("unit to be spawned from array ",unitName)
                    model.spawnExact(controllingPlayer,unitName,waveObject.planet,groupSpawnPoint,[0,0,0]);

                })
                
    
            }
           
        }


    }).catch(function(err){console.log(err)})
    if((model.scenarioModel.RealTimeSinceLanding)%waveObject.waveInterval >0 && (model.scenarioModel.RealTimeSinceLanding%waveObject.waveInterval <2 && waveObject.timesCalled >0 && waveObject.lastCalled!==model.scenarioModel.RealTimeSinceLanding)){scalingRatio = (waveObject.scalingRatio*waveObject.progress)}
    var difficultyIncrease = waveObject.scalingNumber + scalingRatio
    var returnValue = waveObject.progress+difficultyIncrease
    return returnValue;//raises the difficulty
   




}