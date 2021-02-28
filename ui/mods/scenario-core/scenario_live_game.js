



    var originalCall = engine.call
    engine.call = function(method) {
 
      if (method == 'unit.debug.copy') {
        console.log("not allowed for player")
        return undefined;
      }

      if (method == 'unit.debug.paste') {
        console.log("not allowed for player")
        return undefined;
      } else if (method == 'unit.debug.setScenarioSpecId') {
        method = 'unit.debug.setSpecId';
        return originalCall.apply(this, arguments);
      }
        else if (method == 'unit.debug.scenarioPaste') {
            method = 'unit.debug.paste';
            return originalCall.apply(this, arguments);
           
      } else {
        return originalCall.apply(this, arguments);
      }
    }
     



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

    self.playerNameArray = []; //contains the player names matches in order with the id's for reference, mostly for the ui.

    self.playerArray = []; //contains the player id for everyone in lobby, stored here so other code can use this as a stable reference

    self.aiArray = ([])//would contain an object for each ai with things like armyindex, avatarid

    self.scenarioComplete = (false); //if true display a ending message or trigger something??

    self.landTime = 200000;

    self.RealTimeSinceLanding = -200000;

    self.fullTime = 0;

    self.author = "author";

    self.scenarioName = "scenario name";

    self.replacementCom = "/pa/units/commanders/scenario_invincible_com/scenario_invincible_com.json"

    self.playerSpawn = {//this need to be made array compatible for shared

      zones: undefined,

      chosenPos:undefined,

      chosenPlanet: undefined,

      chosenOrientation: undefined


    }

    self.playerCommanderType =  ko.observable(-1).extend({ session: 'selectedCommanderSpec' })();

    self.playerCommanderId = undefined;

    self.noSelection = ["/pa/units/commanders/scenario_avatar/scenario_avatar.json","/pa/units/air/scenario_loader/scenario_loader.json"];
}
model.scenarioModel = new ScenarioViewModel();

  var selectionChecker = ko.computed(function(){
  var noSelect = model.scenarioModel.noSelection;
  var unwantedId = [];
  if(model.selection() == undefined || model.selection() == null){return}
  var selectionId = model.selection().spec_ids;
  
  for(var i = 0;i<noSelect.length;i++){

    if(selectionId[noSelect[i]] !== undefined){
     
      for(var j = 0;j<selectionId[noSelect[i]].length;j++){
        unwantedId.push(selectionId[noSelect[i]][j])
      } 

    }

  }

  var wantedId = [];

  var selectedKeys = _.keys(selectionId)
 
  for(var i = 0;i<selectedKeys.length;i++)
  {

    for(var j = 0;j<selectionId[selectedKeys[i]].length;j++){
      wantedId.push(selectionId[selectedKeys[i]][j])
    }
  }
 
  oldWantedId = wantedId;

  wantedId = _.difference(wantedId,unwantedId)

  if(oldWantedId.length <= wantedId.length){return oldWantedId}

  api.select.unitsById(wantedId);



})

function getAvatarId(){
    
    avatarPromise = model.allPlayerArmy(model.armyIndex(),"/pa/units/commanders/scenario_avatar/scenario_avatar.json");
    avatarPromise.then(function(result){
    
      try{
      if(result["/pa/units/commanders/scenario_avatar/scenario_avatar.json"] == undefined || _.isEmpty(result["/pa/units/commanders/scenario_avatar/scenario_avatar.json"])){_.delay(getAvatarId,1000);return}
     console.log("got avatar id")
      //model.scenarioModel.avatarId = result["/pa/units/commanders/scenario_avatar/scenario_avatar.json"]
      
      model.scenarioModel.avatarId = result["/pa/units/commanders/scenario_avatar/scenario_avatar.json"]
    }
      catch(err){console.log(err)}

    var playerAmount = model.playerListState().players.length;
    for(var i = 0;i<playerAmount;i++){
      model.scenarioModel.playerArray.push(i)
      model.scenarioModel.playerNameArray.push(model.players()[i].name)
    }

    
    })
}

function getCommanderId(){
  
  commanderPromise = model.allPlayerArmy(model.armyIndex(),"",false,"UNITTYPE_Commander");
  commanderPromise.then(function(result){
    console.log(result)
    if(result == undefined || _.isEmpty(result)){_.delay(getCommanderId,1000);return}
    model.scenarioModel.playerCommanderId = [];
    for(var property in result){
      for(commanderIndex in result[property]){
        model.scenarioModel.playerCommanderId.push(result[property][commanderIndex])

      }
      
    }
 
  
  })
}

var cursor_x = -1;
var cursor_y = -1;
document.onmousemove = function(event)
{

cursor_x = event.pageX;
cursor_y = event.pageY;
}

model.setupScenario = function(scenarioJSON){
  
    model.currentFocusPlanetId =function () {
    return api.camera.getFocus(api.Holodeck.focused.id).planetId()
    }
    var planet = model.currentFocusPlanetId();
    if(planet <0){_.delay(model.setupScenario,100,scenarioJSON);return}
 
    console.log("after planet check")
    if(scenarioJSON["requireBuilders"] == true){
      console.log("before holodeck check")
      var hdeck = model.holodeck;
      hdeck.raycastTerrain(cursor_x, cursor_y).then(function(loc3D) {
        console.log("inside holodeck .then")
          if (loc3D.pos) {

            if(loc3D.pos[0]>100 || loc3D.pos[0]<-100 ){
            console.log("before spawn avatar")
            api.Panel.message("devmode","spawnAvatar",model.armyIndex());
            console.log("after spawn avatar")
            setTimeout(getAvatarId,500)
            setTimeout(getCommanderId,2000)
            }
            else{_.delay(model.setupScenario,100,scenarioJSON);return}
          }
          else{_.delay(model.setupScenario,100,scenarioJSON);return}
        })
       
    }
    model.scenarioModel.author = scenarioJSON["author"]
    model.scenarioModel.scenarioName = scenarioJSON["name"]
return;
}


handlers.ScenarioTime = function(payload) {
    
    if(model.scenarioModel !== undefined){
      
    model.scenarioModel.fullTime = Math.round(payload);
    if((model.scenarioModel.playerCommanderId !== undefined || model.hasSelection()) && model.gameOver() == false && model.maxEnergy() > 0){
  
        if( model.scenarioModel.fullTime<model.scenarioModel.landTime &&  model.scenarioModel.fullTime !== 0){model.scenarioModel.landTime =  model.scenarioModel.fullTime}
      
    }
    if(model.scenarioModel.landTime !== 200000){
       if(model.scenarioModel.playerSpawn.chosenPos == undefined){model.getCommanderData()}
        var realTime = model.scenarioModel.fullTime - model.scenarioModel.landTime;
        model.scenarioModel.RealTimeSinceLanding = realTime;
        api.Panel.message("LiveGame_FloatZone", 'scenarioTime',realTime)
        api.Panel.message("LiveGame_FloatZone", 'scenarioDetails',[model.scenarioModel["author"],model.scenarioModel["scenarioName"]])
        
    }}
  
    
};

handlers.ScenarioLandingZones = function(payload) {
  
  model.scenarioModel.playerSpawn.zones = payload;

}

handlers.ScenarioLandingPosition = function(payload) {

  if(model.scenarioModel.playerCommanderType == -1){model.scenarioModel.playerCommanderType = payload.playerCom;}
  
  //model.playerArmy(model.armyIndex(),payload.planet,payload.playerCom,false).then(function(result){model.scenarioModel.playerCommanderId = result[payload.playerCom]; console.log("player commander id is " + result)})


}

    