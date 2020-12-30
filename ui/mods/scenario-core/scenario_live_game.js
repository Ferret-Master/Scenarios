
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

}
var scenarioModel = new ScenarioViewModel();
function getAvatarId(){

    avatarPromise = model.playerArmy(model.armyIndex(), model.currentFocusPlanetId(),"/pa/units/commanderd/avatar/avatar.json", false);
    avatarPromise.then(function(result){ScenarioViewModel().avatarId = result})

}


model.setupScenario = function(scenarioJSON){
    
    console.log("scenario settings: "+JSON.stringify(scenarioJSON))

    if(scenarioJSON["requireBuilders"] == true){
        api.Panel.message("devmode","spawnAvatar",model.armyIndex());
        setTimeout(getAvatarId,50)
    }
    
return;
}