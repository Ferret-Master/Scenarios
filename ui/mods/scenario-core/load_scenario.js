/*
this function takes in the scenario json and spkits it up/starts up the other functions that need to run

Currently each scenario file contains 3 major areas. 

- The scenario settings, these will be passed to scenario live game after the other 2 are passed on. These will be checked and stop a scenario starting if incorrect settings are set.

- The objective settings, these will be passed into objectives_live_game.

- The trigger settings, these will be passed into triggers_live_game.

*/

function loadScenario(location){//will be made into an api/observable later , will be loaded by command for testing, followed by checking for system load.

    model.unitKeys = _.keys(model.unitSpecs)

    $.getJSON('coui:/mods/scenarios/' + location).then(function(imported) {
        
        
        console.log(JSON.parse(JSON.stringify(imported)))

       
        console.log(JSON.parse(JSON.stringify(imported["objectives"])))
        
        console.log(JSON.parse(JSON.stringify(imported["triggers"])))
     
        
       
    
        model.setupTriggers(imported["triggers"]);
        model.setupScenario(imported);
        model.setupObjectives(imported);

        


    });

    
   
};
function loadTestScenario(){loadScenario("test_scenario_2.json")}
setTimeout(loadTestScenario,1000)