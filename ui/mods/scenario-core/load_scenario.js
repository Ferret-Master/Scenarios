/*
this function takes in the scenario json and spkits it up/starts up the other functions that need to run

Currently each scenario file contains 3 major areas. 

- The scenario settings, these will be passed to scenario live game after the other 2 are passed on. These will be checked and stop a scenario starting if incorrect settings are set.

- The objective settings, these will be passed into objectives_live_game.

- The trigger settings, these will be passed into triggers_live_game.

*/

function loadScenario(location){//will be made into an api/observable later , will be loaded by command for testing, followed by checking for system load.

    var scenarioJSON = $.getJSON(location);

    var scenarioObjectives = scenarioJSON.objectives;
    var scenarioTriggers = scenarioJSON.triggers;
    delete scenarioJSON.objectives;
    delete scenarioJSON.triggers;
    var scenarioSettings = scenarioJSON;


    model.setupTriggers(scenarioTriggers);
    model.setupScenario(scenarioSettings);
    model.setupObjectives(scenarioObjectives);
};

loadScenario("coui://ui/mods/scenarios/test_scenario_1.json")