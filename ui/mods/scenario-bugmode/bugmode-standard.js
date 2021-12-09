//standard does not alter or affect game balance
//main changes from just spawn waves is the addition of bug bases and some more randomised events to make it far more engaging


bug_standard = {
    //this needs to be expanded with each unit type to facilitate upgrades
   waveObject:undefined,
   hivePointsAndTypes:[],
   creepPoints:[],
   dontSpawnPoints:[],
   creep:"/pa/units/bug_base/bug_creep/bug_creep.json",
   basicHive:"/pa/units/bug_base/basic_hive/basic_hive.json",
   wall:"/pa/units/bug_base/bug_wall/bug_wall.json",
   spire:"/pa/units/bug_base/bug_turret_small/bug_turret_small.json",
   antiAir:"/pa/units/land/air_defense/air_defense.json",
   mediumEgg:"/pa/units/bug_base/bug_egg_medium/bug_egg_medium.json",
   smallEgg:"/pa/units/bug_base/bug_egg_small/bug_egg_small.json",
   titan:"/pa/units/land/bug_titan/bug_titan.json",
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

    
    generateValidRandomSpawnsOutsideTower(this.planetRadius,baseValue,this.planetId,bug_standard.basicHive).then(function(points){
        
        bug_standard.updateDontSpawnPoints()
        var validPoints = points;
    
        validPoints.forEach(function(point){
     
        model.spawnExact(bug_standard.bugPlayer,bug_standard.creep, bug_standard.planetId,point,[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,bug_standard.basicHive, bug_standard.planetId,point,[0,0,0])
        model.spawnExact(model.armyIndex(),"/pa/units/land/temp_vision_small/temp_vision_small.json", bug_standard.planetId,point,[0,0,0])
    
    })
    bug_standard.startComplete = true;

    })


    
    
},

spawnCreep:function(attempts){
    
    
    console.log("attempting to spawn creep")
    generateValidRandomSpawns(this.planetRadius,attempts,this.planetId,bug_standard.creep,true).then(function(points){
    // console.log(points,this.creepPoints)
    // console.log(validPoints)
    if(points.length < 1){return}
    
    
    validPoints = pointsInArrayBands(points, bug_standard.creepPoints,80,100,true)
    
    newValidPoints = pointsInArrayBands(validPoints, bug_standard.dontSpawnPoints,300,2000)
 
    newValidPoints.forEach(function(point){
        model.spawnExact(bug_standard.bugPlayer,bug_standard.creep, bug_standard.planetId,point,[0,0,0])
        model.spawnExact(model.armyIndex(),"/pa/units/land/temp_vision_small/temp_vision_small.json", bug_standard.planetId,point,[0,0,0])
    })
})

},

spawnBasicHives:function(attempts, ratios){
    console.log("attempting to spawn hives")
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
    mediumHivesToUpgrade = (mediumHives.length - (playerNum*2) - (advancedHives.length*3))/2;
    
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
    
    generateValidRandomSpawns(this.planetRadius,attempts,this.planetId,bug_standard.spire,true).then(function(points){
    var validPoints = pointsInArrayBands(points, bug_standard.creepPoints,0,100,true)
    if(validPoints.length < 1){return}
    validPoints = pointsInArrayBands(validPoints, bug_standard.dontSpawnPoints,300,2000)
    validPoints.forEach(function(point){
        model.spawnExact(bug_standard.bugPlayer,bug_standard.spire, bug_standard.planetId,point,[0,0,0])

    })
})
},

spawnWall:function(attempts){
    generateValidRandomSpawns(this.planetRadius,attempts,this.planetId,bug_standard.wall,true).then(function(points){
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
spawnNest:function(eggCount,maxSpread,nestUnit){
    eggCount = eggCount/3 //adjusted down due to 3 per egg
    generateValidRandomSpawns(this.planetRadius,30,this.planetId,bug_standard.basicHive).then(function(points){
    var validPoints = pointsInArrayBands(points, bug_standard.creepPoints,0,150,true)
    if(validPoints.length < 1){return}
    validPoints = pointsInArrayBands(validPoints, bug_standard.dontSpawnPoints,300,2000)
        
       var point =   _.sample(validPoints)

       for(var i = 0;i<eggCount;i++){
            
            var offset1 = Math.random()*maxSpread*( Math.random() < 0.5 ? -1 : 1);
            var offset2 = Math.random()*maxSpread*( Math.random() < 0.5 ? -1 : 1);
            var offset3 = Math.random()*maxSpread*( Math.random() < 0.5 ? -1 : 1);
            var newPoint =[point[0]+offset1,point[1]+offset2,point[2]+offset3]
            model.spawnExact(bug_standard.bugPlayer,nestUnit, bug_standard.planetId,newPoint,[0,0,0])
       }
    
    

})


},

spawnTitan:function(titanCount){
    generateValidRandomSpawns(this.planetRadius,300,this.planetId,bug_standard.basicHive).then(function(points){
    var validPoints = pointsInArrayBands(points, bug_standard.creepPoints,0,150,true)
    if(validPoints.length < 1){return}
    validPoints = pointsInArrayBands(validPoints, bug_standard.dontSpawnPoints,300,2000)
       var point =   _.sample(validPoints)

      
        model.spawnExact(bug_standard.bugPlayer,bug_standard.titan, bug_standard.planetId,point,[0,0,0])
       
    
    

})
},


//takes in a 2d array  and spawns units at each hive based on its type, has a difficulty multiplier for easier scaling
spawnHiveWave:function(hivePointsAndTypes, difficulty,waveObject){
    players = model.players()
    wavePlayer = 0;
    wavePlayerFound = false;
    for(var i = 0;i<players.length;i++){
        if(players[i].ai == 0 && players[i].defeated == false && wavePlayerFound == false){
                wavePlayer = i;
                wavePlayerFound = true;
        }
    }
    if(model.armyIndex() !== wavePlayer){var nestOnly = true}
    var advanced_hive_exists = false;
    var advanced_hive_amount = 0;
    var medium_hive_amount = 0;
   hivePointsAndTypes.forEach(function(point){
       for(var i = 0;i<difficulty;i++){//difficulty directly multiplies spawns

       if(point[0] == "/pa/units/bug_base/basic_hive/basic_hive.json"){//spawn grunts/alpha grunts if time/upgrade building?
        if(!nestOnly == true){
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt/bug_grunt.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt/bug_grunt.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt/bug_grunt.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt/bug_grunt.json", bug_standard.planetId,point[1],[0,0,0])
        }
       }
       if(point[0] == "/pa/units/bug_base/basic_hive/basic_hive.json"){//spawn scouts
        if(!nestOnly == true){
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_scout/bug_scout.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_scout/bug_scout.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_scout/bug_scout.json", bug_standard.planetId,point[1],[0,0,0])
        }
     
       }
       if(point[0] == "/pa/units/bug_base/medium_hive/medium_hive.json"){//spawns warriors
        medium_hive_amount++
        if(!nestOnly == true && model.scenarioModel.RealTimeSinceLanding > 300){
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_warrior/bug_warrior.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt_big/bug_grunt_big.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt_big/bug_grunt_big.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt_big/bug_grunt_big.json", bug_standard.planetId,point[1],[0,0,0])
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_grunt_big/bug_grunt_big.json", bug_standard.planetId,point[1],[0,0,0])
        }
       
       }
       if(point[0] == "/pa/units/bug_base/medium_hive/medium_hive.json"){//spawn scorcher
        if(!nestOnly == true && medium_hive_amount>2 && model.scenarioModel.RealTimeSinceLanding > 300){
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_scorcher/bug_scorcher.json", bug_standard.planetId,point[1],[0,0,0])
        }
       }
       if(point[0] == "/pa/units/bug_base/advanced_hive/advanced_hive.json"){//spawn basilisk
        if(!nestOnly == true){
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_basilisk/bug_basilisk.json", bug_standard.planetId,point[1],[0,0,0])
        }
       }
       if(point[0] == "/pa/units/bug_base/advanced_hive/advanced_hive.json"){//spawn alpha warrior
        if(!nestOnly == true){
        model.spawnExact(bug_standard.bugPlayer,"/pa/units/land/bug_warrior_big/bug_warrior_big.json", bug_standard.planetId,point[1],[0,0,0])
        }
        advanced_hive_exists = true;
        advanced_hive_amount++;
       }
    }
      
    })
    if(advanced_hive_exists){
        bug_standard.spawnNest(advanced_hive_amount*5,50,bug_standard.mediumEgg)
        if(advanced_hive_amount>4 && !nestOnly == true){
            bug_standard.spawnTitan(advanced_hive_amount/5)
        }
    }
    else{
         bug_standard.spawnNest(medium_hive_amount*5+(1*5),40,bug_standard.smallEgg)
    }
      _.delay(function(){
            waveObject.waveInterval +=1;
        },10000)
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
       
        _.delay(function(){

        var buildingMultiplier = (bug_standard.planetRadius*bug_standard.planetRadius*12)/(1080000)//multiplies spawn attempts by surface differencce
        
        buildingMultiplier = waveObject.spreadRate //+ buildingMultiplier/2;//natrually more players on larger maps so until I factor playerocunt to scaling this is here
        //after wave is spawned the base grows, currently this scaled inversly with map radius so needs some form of scaling for that, spawn method is fundementally worse the bigger the planet gets
        console.log("attempting to expand base")
        bug_standard.spawnCreep(25*buildingMultiplier)
        bug_standard.spawnBasicHives(6*buildingMultiplier)
        bug_standard.upgradeHive()
        bug_standard.spawnSpire(8*buildingMultiplier)
        bug_standard.spawnWall(100*buildingMultiplier)
        bug_standard.spawnDefenders()

        },3000)
        
        
        


    }
    if((model.scenarioModel.RealTimeSinceLanding)%waveObject.waveInterval >0 && (model.scenarioModel.RealTimeSinceLanding%waveObject.waveInterval <2 && waveObject.timesCalled >0) && waveObject.lastCalled !==(model.scenarioModel.RealTimeSinceLanding)){
        //this needs a more reliable fix so super waves are not spawned
        bug_standard.updateHiveAndCreepPoints();
      
        _.delay(function(){
            
            bug_standard.spawnHiveWave(bug_standard.hivePointsAndTypes,1, waveObject);
        },3000)
      

    }
    waveObject.lastCalled = model.scenarioModel.RealTimeSinceLanding;
    if(bug_standard.dontSpawnPoints.length<1 && bug_standard.startComplete == false){bug_standard.updateDontSpawnPoints();return 10}
    if(bug_standard.startComplete == false && model.scenarioModel.RealTimeSinceLanding <5){bug_standard.updateDontSpawnPoints()}
    if(bug_standard.creepPoints.length<1 && bug_standard.startComplete == false && model.scenarioModel.RealTimeSinceLanding > 5){bug_standard.updateDontSpawnPoints();bug_standard.spawnStartingBugBase(3);return 10}
    if(bug_standard.creepPoints.length<1 && bug_standard.startComplete == true && model.scenarioModel.RealTimeSinceLanding > 5){bug_standard.updateDontSpawnPoints(); bug_standard.updateHiveAndCreepPoints();return 10}
    if(bug_standard.hivePointsAndTypes.length <1  && model.scenarioModel.RealTimeSinceLanding > 100){model.triggerFunctions["kill_all_invincible_ai"]({})}//if all creep and hives have been defeated kill the bug ai
    return 10;//dummy value since progress is not timed based directly
}    