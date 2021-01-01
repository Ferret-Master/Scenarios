
/*
so far this will probably be used mainly for verifying the scenario so it does not run with incorrect lobby/ game setups.

will probably add some flags so that only the lobby host can issue the cheat commands. That way everyone gets ui but people don't double up on commands, mainly an issue for shared.


this triggers the necessary api for setting up certain scenario's as well.

any scenario that requires building will have this spawn in avatar fabs at the start

also keeps track of things, as it is not appropriate for objectives or triggers to do so.



*/ 

function ScenarioViewModel() {

    var self = this;

    self.avatarId  = -1;

    self.aiArray = ([])//would contain an object for each ai with things like armyindex, avatarid

    self.scenarioComplete = (false); //if true display a ending message or trigger something??

    self.landTime = 200000;

    self.RealTimeSinceLanding = -200000;

    self.fullTime = 0;
}
model.scenarioModel = new ScenarioViewModel();
function getAvatarId(){
    var planet = model.currentFocusPlanetId();
    if(planet <0){_.delay(getAvatarId,1000);return}
    avatarPromise = model.playerArmy(model.armyIndex(), model.currentFocusPlanetId(),"/pa/units/commanders/avatar/avatar.json", false);
    avatarPromise.then(function(result){model.scenarioModel.avatarId = result})

}


model.setupScenario = function(scenarioJSON){
    var planet = model.currentFocusPlanetId();
    if(planet <0){_.delay(model.setupScenario,1000,scenarioJSON);return}
    console.log("scenario settings: "+JSON.stringify(scenarioJSON))

    if(scenarioJSON["requireBuilders"] == true){
        api.Panel.message("devmode","spawnAvatar",model.armyIndex());
        setTimeout(getAvatarId,500)
    }
    
return;
}



handlers.ScenarioTime = function(payload) {
    
    if(model.scenarioModel !== undefined){
    model.scenarioModel.fullTime = Math.round(payload);
    if(model.hasSelection() && model.maxEnergy() > 0 && model.gameOver() == false){

        if( model.scenarioModel.fullTime<model.scenarioModel.landTime &&  model.scenarioModel.fullTime !== 0){model.scenarioModel.landTime =  model.scenarioModel.fullTime}

    }
    if(model.scenarioModel.landTime !== 200000){

        var realTime = model.scenarioModel.fullTime - model.scenarioModel.landTime;
        model.scenarioModel.RealTimeSinceLanding = realTime;
        
    }}
    
};


    