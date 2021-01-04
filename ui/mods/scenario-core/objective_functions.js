/*

this file contains all the functions that will  be called for checking and displaying objectives

the top half will be objectiveCheckFunctions that check the progress/fulfillment of an objective.

the bottom half are objectiveEffect functions and are ran when an objective becomes active. They are essentially built in triggers for each objective so that the scenario objectives don't require a bunch of starting triggers.

it is possible I will switch to them in future though.

e.g units in area will need an effect circle to signify the area.

*/



model.objectiveCheckFunctions = {};

model.objectiveEffectFunctions = {};

/*
------------------------------------------- [Objective Checks] -------------------------------------------
*/


/*
returns the number of units in an area.
basis for other area functions such as grabbing the types or id's of units in an area.

TODO needs array checks, same applys to functions it is calling.
*/
model.objectiveCheckFunctions["units_in_area"] = function (objectiveObject, playerId) {

    var unitCount = objectiveObject.needed;
    var areaLocation = objectiveObject.location; // planet, center coordinates, and radius
    var unitType = objectiveObject.unitType; //the units file name
    var specificUnit = objectiveObject.specificUnit;
    var specificUnitId = objectiveObject.specificUnitId;
    if (unitType == undefined) { unitType = "" }

    //needs to be expanded for this to be useful
    if (specificUnit == true) { //currently only checks 1 id
        model.unitsInRadius(playerId, unitType, areaLocation).then(function (units) {
            if (_.contains(units, specificUnitId)) { return true }
            return 0;
        });

    }

    else {

        var armyPromise = model.playerArmy(playerId, areaLocation[0].planet, unitType, true)

        return armyPromise.then(function (playerArmy) {

            var radiusPromise = new Promise(function (resolve, reject) { resolve(model.countArmyInRadius(playerArmy, areaLocation[0])); })

           return radiusPromise.then(function (units) {

                if (_.isArray(units)) {
                    if (units.length >= unitCount) { return true }
                    return units.length;

                }
                else {

                    if (units >= unitCount) { return true }
                    else { return units }


                }
            }).catch(function (err) { console.log(err) });
   
        }).catch(function (err) { console.log(err) })


    }

}

/*
------------------------------------------- [Objective Effects] -------------------------------------------
*/




/*
spawns a colored ring at a chosen location with a size roughly equal to the circle made by the given radius.
*/
model.objectiveEffectFunctions["radius_ring"] = function (colorName, location, radius, duration) {


}





