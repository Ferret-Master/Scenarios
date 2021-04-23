/**EXAMPLE PREFAB FORMAT
 * 
 * going to use existing format for now as stuff was built around it
 * 
 * although it is less useful now that creat_unit exists
 * 
 * "prefab": {
                "planet": 0,
                "units": [
                    {
                        "unitType": "/pa/units/land/titan_structure/titan_structure.json",
                        "pos": [
                            27.47,
                            -429.8651123046875,
                            -101.718804931640625
                        ],
                        "orientation": [
                            0,
                            0,
                            0
                        ]
                    }
                ]
            }
 */



model.recordPrefab = function(){
    var planet = model.currentFocusPlanetId();
    if(planet <0){_.delay(model.recordPrefab,100);return}

    var prefab = {
        "planet":planet,
        "units":[]
    }
    var selectedIdArray = [];
    if(model.selection()){
        // gets the ids of the players selection
        selectedUnitArray = model.selection().spec_ids;
        var unitKeys = _.keys(selectedUnitArray);
        for(key in unitKeys){
          
            selectedIdArray = selectedIdArray.concat(selectedIdArray, selectedUnitArray[unitKeys[key]]);
           

        }

        var armyPromise = api.getWorldView(0).getUnitState(selectedIdArray)

        //gets the unit information of the selection
        armyPromise.then(function(result){

            for(resultIndex in result){
                var preFabUnit = {}
                var unitData = result[resultIndex]
                preFabUnit.unitType = unitData.unit_spec
                preFabUnit.pos = unitData.pos
                preFabUnit.orientation = unitData.orient
                prefab.units.push(preFabUnit)
            }


            console.log(JSON.stringify(prefab))

        })
       
   

    }

    var selectedIdArray = [];

}

action_sets.gameplay["recordPrefab"] = function(){

    model.recordPrefab()

}