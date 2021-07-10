
//valid spawns(not in cssg/water/lava)
function filterValidpoints(pointArray){


}


function generatePlanetPoints(r){
    //spawn point generation, need a large initial amount generated so that there is not major structure stacking
    return model.generateRandomPoints(r, 1000)

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





function validSpawns(points,planet,spec){//takes in array of points and returns valid ones
    fixupPromiseArray = []
    for(var i = 0;i < points.length;i++){
    var pointLoc = {}
    pointLoc.pos = points[i]
    var fixedloc = engine.call('worldview.fixupBuildLocations', world.id, spec, Number(planet), JSON.stringify([pointLoc]));
    fixupPromiseArray.push(fixedloc);
    
}
console.log(fixupPromiseArray)    

var fixupPromise = Promise.all(fixupPromiseArray);
console.log(fixupPromise)   
return fixupPromise.then(function(ready) {
                                    
    console.log("in promise all promise",ready) 
            
    var returnArray = []
    for(var i = 0;i < ready.length;i++){
        console.log("in loop")
        var result = JSON.parse(ready[i])
        console.log("1",result)
        result = result[0]
            console.log("2",result)
            var fixupResult = result//JSON.parse(result);
            console.log("fixupResult: ",fixupResult)
            
            if(fixupResult.ok == false || fixupResult.desc !== undefined){

                console.log("invalid location")
                

            }
            else{console.log("found location");returnArray.push(fixupResult.pos)}
       

        }
        return returnArray;
                                        
                                        
        }).catch(function (err) {
            console.log("outer Promise Rejected");
            console.log(err);
        });

}

function testValidSpawns(){

    var points = generatePlanetPoints(500)

    validSpawns(points,0)




}


generateValidRandomSpawns = function(r,numPoints,planet,spec){
    var pointsArray= [];
    for(var i = 0; i<numPoints; i++){pointsArray.push(rand_sphere_point(r))}
    return validSpawns(pointsArray,planet,spec);

}