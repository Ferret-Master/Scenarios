


/*
takes in the model name and returns the full path.
*/

world = api.getWorldView(0);

let unitKeys = _.keys(model.unitSpecs);


model.executeAsPlayer = function(playerIndex, command, commandVars, timeout){
    if(timeout == undefined){var timeout = 50}
    var switchPlayer = false;
    if(playerIndex !== "" && playerIndex !== undefined){switchPlayer = true}

    if(switchPlayer == true){
                            
        api.Panel.message("devmode","switchControl",playerIndex);

        var tempFunc = function(commandVars){command(commandVars);}
        commandVars.unshift(null);
        setTimeout(tempFunc.bind(commandVars),timeout);
       		
            
        }
        else{
            
        command(commandVars);
        

        }



}

model.fullUnitName = function(unitName){


    unitName+=".json";
    var chosenUnit;
    
    for(var i = 0;i<unitKeys.length;i++){
        
        if(unitKeys[i].endsWith(unitName)){
            chosenUnit = unitKeys[i];
            
        }
    }
    if(!chosenUnit.length>1){return ""}
    return chosenUnit;

}
/*

if stateflag is true returns all of the unit states instead.

should probably add a unitflag to this in case I only want one unittypes states.

*/
model.playerArmy = function(playerId, planetId,unitType, stateFlag){

    if(world){

        if(stateFlag !== true)return world.getArmyUnits(playerId,planetId)

        else{
            world.getArmyUnits(playerId,planetId).then(function (result){ //doubt this works as is.
                var unitArray = [];
                
                if(result.hasOwnProperty(unitType)){result = result[unitType]}
                if(stateFlag !== true){return result[unitType]}
                
                armyKeys = _.keys(result)
                for(var i = 0;i<armyKeys.length;i++){
                    unitArray.push(world.getUnitState(result[armyKeys[i]]))

                }
                Promise.all(unitArray).then(function (result){return result})
            })
            
        }


    }



}

model.distanceBetween = function(point1,point2,R){
		
		
    //console.log("running distance between")
    //console.log("calc1: "+Math.pow(Math.cos,-1))
    //console.log("calc2: "+((point1[0])*(point2[0])+(point1[1])*(point2[1])+(point1[2])*(point2[2])))
    //console.log("calc3: "+(Math.pow(R,2)))
    //console.log("calc4: "+point2[2])
    
    //console.log(R*Math.acos((((point1[0])*(point2[0])+(point1[1])*(point2[1])+(point1[2])*(point2[2]))/(Math.pow(R,2)))))
    var DistanceBetweenPoints = R*Math.acos((((point1[0])*(point2[0])+(point1[1])*(point2[1])+(point1[2])*(point2[2]))/(Math.pow(R,2))));

    
    
    return DistanceBetweenPoints;
}

model.inRadius = function(point,center,R){
    if (distanceBetween(point,center,R) < R)
        return true;
    
    else
        return false;
    
    
}
/*
returns either the number/id's of that unit type in the radius, or if type is not specified, total unit number/id's.
*/
model.unitsInRadius = function(playerId,unitType, location, dataFlag){// this will be a rough function performance wise if reguarly checked so should be used sparingly.
    
    var playerArmy = model.playerArmy(playerId,location.planet,unitType, true)
    
    

    var returnNumber = 0;

    var returnArray = [];

    if(unitType == ""){// want to return total number of units in that area
        returnValue = 0;
        for(var i = 0;i<playerArmy.length;i++){
            var unitPos = playerArmy[i].pos;
            if(this.inRadius(unitPos, location.pos, location.radius) == true){returnValue++;returnArray.push(playerArmy[i])}
        }
        

    }
    else{

        returnValue = 0;
        for(var i = 0;i<playerArmy.length;i++){
            var unitPos = playerArmy[i].pos;
            if(this.inRadius(unitPos, location.pos, location.radius) == true){returnValue++;returnArray.push(playerArmy[i])}
        }

    }
    if(dataFlag == true){return returnArray}

    else{return returnNumber}


    
}

model.randomLocations = function(amount,radius){ // returns array of random locations within 3d space of a certain radius
    
    var posArray = [];
    for(var points = 0; points<amount;points++){
                                    var pos1 = Math.floor(Math.random() * radius+1);
                                    var pos2 = Math.floor(Math.random() * radius+1);
                                    var pos3 = Math.floor(Math.random() * radius+1);
                                    
                                    posArray.push([pos1,pos2,pos3]);
                                    
                                    for(var count = 0; count<3;count++){
                                        var sign = Math.floor(Math.random() * 11);
                                        if (sign > 4){posArray[points][count] = posArray[points][count]*-1;}							
                                    }
    }
    
    return posArray;
}