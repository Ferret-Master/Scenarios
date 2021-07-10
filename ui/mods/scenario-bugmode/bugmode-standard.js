//standard does not alter or affect game balance
//main changes from just spawn waves is the addition of bug bases and some more randomised events to make it far more engaging


bug_standard = {
    
   waveObject:undefined,
   hivePointsAndTypes:[],
   creepPoints:[],
   dontSpawnPoints:[],
   creep:"/pa/units/bug_base/bug_creep/bug_creep.json",
   basicHive:"/pa/units/bug_base/basic_hive/basic_hive.json",
   wall:"/pa/units/bug_base/bug_wall/bug_wall.json",
   spire:"/pa/units/land/laser_defense/laser_defense.json",
   antiAir:"/pa/units/land/air_defense/air_defense.json",
   bugPlayer:undefined,
   planetRadius:undefined,
   planetId:undefined,
   startComplete:false,
//updates the local location values, means I don't need to worry about async in the other functions
updateHiveAndCreepPoints:function(){

    bugPlayerCreepPromise = model.playerArmy(this.bugPlayer,this.planetId,"/pa/units/bug_base/bug_creep/bug_creep.json",true,"")
    bugPlayerHivePromise = model.playerArmy(this.bugPlayer,this.planetId,"",true,["UNITTYPE_NoBuild","UNITTYPE_Custom2","UNITTYPE_Factory"])
    bugPlayerHivePromise.then(function(result){
 
      
        hivePoints = []
        for(unitIndex in result){
            unit = result[unitIndex]
            
            hivePoints.push([unit.unit_spec,unit.pos])
           
        }
        bug_standard.hivePointsAndTypes = hivePoints
    })
    bugPlayerCreepPromise.then(function(result){
        
        creepPoints = []

        for(unitIndex in result){
            unit = result[unitIndex]
            
            creepPoints.push(unit.pos)
           
        }
        bug_standard.creepPoints = creepPoints
    })

},
updateDontSpawnPoints:function(){

    players = model.players()
    army = []
    for(playerIndex in players){
        var player = players[playerIndex]
        if(player.ai == true && player.stateToPlayer == "hostile"){
            //bug player
        }
        if(player.econ_rate == 0.1){

            this.bugPlayer = parseInt(playerIndex);
        }
        
        else{
            army.push(model.playerArmy(playerIndex,this.waveObject.planet,"",true,this.waveObject.dont_spawn_near_unit_type))
        }

    }
    var allArmy = Promise.all(army)
    allArmy.then(function(result){
     
        var locations = []
        for(armyIndex in result){
     
        for(unitIndex in result[armyIndex]){
            unit = result[armyIndex][unitIndex]
     
            if(unit !== undefined){if(unit == undefined){continue}  if(unit.built_frac == undefined){
                locations.push(unit.pos)
            }}
          
        }
    }

    this.dontSpawnPoints = locations
    bug_standard.dontSpawnPoints = locations
})
  
    
},
//spawns the bugs starting base, along with some defensive units, happens a bit after landing so that it avoids players
spawnStartingBugBase:function (baseValue){

    
    generateValidRandomSpawns(this.planetRadius,baseValue,this.planetId,bug_standard.basicHive).then(function(points){
        
        bug_standard.updateDontSpawnPoints()
        var validPoints = pointsInArrayBands(points, bug_standard.dontSpawnPoints,300,2000)

        validPoints.forEach(function(point){
     
        model.spawnExact(bug_standard.bugPlayer,bug_standard.creep, bug_standard.planetId,point,[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,bug_standard.basicHive, bug_standard.planetId,point,[0,0,0])
        model.spawnExact(model.armyIndex(),"/pa/units/land/temp_vision_small/temp_vision_small.json", bug_standard.planetId,point,[0,0,0])
    
    })
    bug_standard.startComplete = true;

    })


    
    
},

spawnCreep:function(attempts){
    
    var points = generateRandomPoints(bug_standard.planetRadius,attempts)

    var validPoints = pointsInArrayBands(points, bug_standard.creepPoints,80,100,true)
    // console.log(points,this.creepPoints)
    // console.log(validPoints)
    if(validPoints.length < 1){return}

    newValidPoints = pointsInArrayBands(validPoints, bug_standard.dontSpawnPoints,300,2000)

    newValidPoints.forEach(function(point){
        model.spawnExact(bug_standard.bugPlayer,bug_standard.creep, bug_standard.planetId,point,[0,0,0])
        model.spawnExact(model.armyIndex(),"/pa/units/land/temp_vision_small/temp_vision_small.json", bug_standard.planetId,point,[0,0,0])
    })

},

spawnBasicHives:function(attempts, ratios){
    generateValidRandomSpawns(this.planetRadius,attempts,this.planetId,bug_standard.basicHive).then(function(points){
    var validPoints = pointsInArrayBands(points, bug_standard.creepPoints,0,100,true)
    if(validPoints.length < 1){return}
    validPoints = pointsInArrayBands(validPoints, bug_standard.dontSpawnPoints,300,2000)
    validPoints.forEach(function(point){
        model.spawnExact(bug_standard.bugPlayer,bug_standard.basicHive, bug_standard.planetId,point,[0,0,0])
    })

})


},

//waas planned to do distance but will do quantity for upgrading
upgradeHive:function(ratios){//upgrades basic hives into other types such as medium/runner, also upgrades medium to advanced
    if(model.armyIndex() !== bug_standard.waveObject.playerIndex){return}
    var hivePoints = bug_standard.hivePointsAndTypes;
    var basicHives = [];
    var mediumHives = [];
    var advancedHives = [];
    playerNum = model.players().length;
    for(var i = 0; i<hivePoints.length;i++){
        if(hivePoints[i][0] == "/pa/units/bug_base/basic_hive/basic_hive.json"){basicHives.push(hivePoints[i][1])}
        if(hivePoints[i][0] == "/pa/units/bug_base/medium_hive/medium_hive.json"){mediumHives.push(hivePoints[i][1])}
        if(hivePoints[i][0] == "/pa/units/bug_base/advanced_hive/advanced_hive.json"){advancedHives.push(hivePoints[i][1])}
    }
    basicHivesToUpgrade = (basicHives.length - (playerNum*3)-(mediumHives.length))/3;
    mediumHivesToUpgrade = (mediumHives.length - (playerNum*2) - (advancedHives.length*2))/2;
    // basicHivesToUpgrade = Math.ceil(basicHivesToUpgrade/4)
    // mediumHivesToUpgrade = Math.ceil(mediumHivesToUpgrade/4)
    for(var i = 0;i<basicHivesToUpgrade;i++){
        clearAndReplaceAtPosition(bug_standard.bugPlayer,_.sample(basicHives),"/pa/units/bug_base/medium_hive/medium_hive.json",bug_standard.planetId)
    }
    for(var i = 0;i<mediumHivesToUpgrade;i++){
        clearAndReplaceAtPosition(bug_standard.bugPlayer,_.sample(mediumHives),"/pa/units/bug_base/advanced_hive/advanced_hive.json",bug_standard.planetId)
    }




},

spawnSpire:function(attempts){
    
    generateValidRandomSpawns(this.planetRadius,attempts,this.planetId,bug_standard.spire).then(function(points){
    var validPoints = pointsInArrayBands(points, bug_standard.creepPoints,0,100,true)
    if(validPoints.length < 1){return}
    validPoints = pointsInArrayBands(validPoints, bug_standard.dontSpawnPoints,300,2000)
    validPoints.forEach(function(point){
        model.spawnExact(bug_standard.bugPlayer,bug_standard.spire, bug_standard.planetId,point,[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,bug_standard.antiAir, bug_standard.planetId,point,[0,0,0])
    })
})
},

spawnWall:function(attempts){
    generateValidRandomSpawns(this.planetRadius,attempts,this.planetId,bug_standard.wall).then(function(points){
    var validPoints = pointsInArrayBands(points, bug_standard.creepPoints,60,100,true)
    if(validPoints.length < 1){return}
    validPoints = pointsInArrayBands(validPoints, bug_standard.dontSpawnPoints,300,2000)
    validPoints.forEach(function(point){
        model.spawnExact(bug_standard.bugPlayer,bug_standard.wall, bug_standard.planetId,point,[0,0,0])
        
       
    })

})

},

//spawns low aggro range bugs to defend bases
spawnDefenders:function(hivePoints){//TODO needs bug copies


},
//takes in a 2d array  and spawns units at each hive based on its type, has a difficulty multiplier for easier scaling
spawnHiveWave:function(hivePointsAndTypes, difficulty){
    if(model.armyIndex() !== bug_standard.waveObject.playerIndex){return}
   hivePointsAndTypes.forEach(function(point){
       for(var i = 0;i<difficulty;i++){//difficulty directly multiplies spawns

       if(point[0] == "/pa/units/bug_base/basic_hive/basic_hive.json"){//spawn grunts/alpha grunts if time/upgrade building?
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt/bug_grunt.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt/bug_grunt.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt/bug_grunt.json", bug_standard.planetId,point[1],[0,0,0])
       }
       if(point[0] == "/pa/units/bug_base/basic_hive/basic_hive.json"){//spawn scouts
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_scout/bug_scout.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_scout/bug_scout.json", bug_standard.planetId,point[1],[0,0,0])
     
       }
       if(point[0] == "/pa/units/bug_base/medium_hive/medium_hive.json"){//spawns warriors
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_warrior/bug_warrior.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt_big/bug_grunt_big.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt_big/bug_grunt_big.json", bug_standard.planetId,point[1],[0,0,0])
       
       }
       if(point[0] == "/pa/units/bug_base/medium_hive/medium_hive.json"){//spawn scorcher
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_scorcher/bug_scorcher.json", bug_standard.planetId,point[1],[0,0,0])
       }
       if(point[0] == "/pa/units/bug_base/advanced_hive/advanced_hive.json"){//spawn basilisk
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_basilisk/bug_basilisk.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
       }
       if(point[0] == "/pa/units/bug_base/advanced_hive/advanced_hive.json"){//spawn alpha warrior
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_warrior_big/bug_warrior_big.json", bug_standard.planetId,point[1],[0,0,0])
       }
       if(point[0] == "/pa/units/bug_base/advanced_nest/advanced_nest.json"){//spawns runners
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_runner/runner.json", bug_standard.planetId,point[1],[0,0,0])
       }}

    })
},
getBugPlayer:function(){
    players = model.players()
            for(playerIndex in players){
                var player = players[playerIndex]
                if(player.ai == true && player.stateToPlayer == "hostile"){
                    controllingPlayer = playerIndex
                }
                if(player.econ_rate == 0.1){
    
                    controllingPlayer = playerIndex
              
                }
    
            }
            this.bugPlayer = parseInt(controllingPlayer);
},
getPlanetRadius:function(){
    var planets = model.planetListState()

    planets = planets.planets
    for(planetIndex in planets){
    
        if(planets[planetIndex].id == this.waveObject.planet){
            this.planetRadius = planets[planetIndex].radius
            this.planetId = this.waveObject.planet
        }
    }
}


}


model.objectiveCheckFunctions["bug_mode_base"] = function (waveObject){
    bug_standard.waveObject = waveObject;
    if(model.paused() == true || model.isSpectator() == true || model.gameOver() == true || model.scenarioModel.landTime == 200000){return}
    if(model.serverRate() < 0.3){model.triggerFunctions["kill_all_invincible_ai"]({})}//kill switch if server has went to shit, requires ai to use the ai invincible com
    if(model.serverRate() < 0.25){model.triggerFunctions["wipe_planet"]({}) ;return}
    if(model.serverRate() < 0.6){return}//dont try and spawn a wave when the server is already slow
    if(bug_standard.bugPlayer == undefined){

        bug_standard.getBugPlayer();
    }
    if(bug_standard.planetRadius == undefined){
        
        bug_standard.getPlanetRadius();

    }
    
  
    if((model.scenarioModel.RealTimeSinceLanding)%waveObject.baseInterval >0 && (model.scenarioModel.RealTimeSinceLanding%waveObject.baseInterval <2) && waveObject.lastCalled !==(model.scenarioModel.RealTimeSinceLanding)){//if it is time to spawn a wave

        bug_standard.updateDontSpawnPoints()
        //after spawning new things update the locations

        //if there is no bug bases create some
        
        //wave is spawned
        bug_standard.updateHiveAndCreepPoints()
        console.log("attempting to expand base")
        _.delay(function(){

        var buildingMultiplier = (bug_standard.planetRadius*bug_standard.planetRadius*12)/(1080000)//multiplies spawn attempts by surface differencce
        
        buildingMultiplier = waveObject.spreadRate //+ buildingMultiplier/2;//natrually more players on larger maps so until I factor playerocunt to scaling this is here
        //after wave is spawned the base grows, currently this scaled inversly with map radius so needs some form of scaling for that, spawn method is fundementally worse the bigger the planet gets
        bug_standard.spawnCreep(20*buildingMultiplier)
        bug_standard.spawnBasicHives(6*buildingMultiplier)
        bug_standard.upgradeHive()
        bug_standard.spawnSpire(10*buildingMultiplier)
        bug_standard.spawnWall(40*buildingMultiplier)
        bug_standard.spawnDefenders()

        },3000)
        
        
        


    }
    if((model.scenarioModel.RealTimeSinceLanding)%waveObject.waveInterval >0 && (model.scenarioModel.RealTimeSinceLanding%waveObject.waveInterval <2 && waveObject.timesCalled >0) && waveObject.lastCalled !==(model.scenarioModel.RealTimeSinceLanding)){

        bug_standard.updateHiveAndCreepPoints()
        _.delay(function(){

            bug_standard.spawnHiveWave(bug_standard.hivePointsAndTypes,1)
        },3000)

    }

    if(bug_standard.dontSpawnPoints.length<1 && bug_standard.startComplete == false){bug_standard.updateDontSpawnPoints();return 10}
    if(bug_standard.creepPoints.length<1 && bug_standard.startComplete == false){bug_standard.updateDontSpawnPoints();bug_standard.spawnStartingBugBase(3);return 10}
    if(bug_standard.creepPoints.length<1 && bug_standard.startComplete == true){bug_standard.updateDontSpawnPoints(); bug_standard.updateHiveAndCreepPoints();return 10}
    return 10;//dummy value since progress is not timed based directly
}    