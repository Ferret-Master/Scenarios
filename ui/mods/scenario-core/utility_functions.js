
//these may be moves into objectives

function distanceBetween(point1,point2,R){
		
		
    //console.log("running distance between")
    //console.log("calc1: "+Math.pow(Math.cos,-1))
    //console.log("calc2: "+((point1[0])*(point2[0])+(point1[1])*(point2[1])+(point1[2])*(point2[2])))
    //console.log("calc3: "+(Math.pow(R,2)))
    //console.log("calc4: "+point2[2])
    
    //console.log(R*Math.acos((((point1[0])*(point2[0])+(point1[1])*(point2[1])+(point1[2])*(point2[2]))/(Math.pow(R,2)))))
    var DistanceBetweenPoints = R*Math.acos((((point1[0])*(point2[0])+(point1[1])*(point2[1])+(point1[2])*(point2[2]))/(Math.pow(R,2))));

    
    
    return DistanceBetweenPoints;
}


function inRadius(point,center,R){
    if (distanceBetween(point,center,R) < R)
        return true;
    
    else
        return false;
    
    
}

function unitsInRadius(){//unfinished
    
    
    
    
    return
}

function randomLocations(amount,radius){ // returns array of random locations within 3d space of a certain radius
    
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