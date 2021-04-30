//this file controls everything that happens in the lobby

/*
Things it needs to do

Allow the host to select a scenario from a drop down menu(or file location)

check/modify the lobby to fit the scenario if needed(don't allow host to start if lobby doesnt work with scenario)

track and modify player commander selection if needed

currently does not work if player doesnt modify com selection, won't be an issue once scenario selection is in as it will force the selection in response


*/





model.annihilationModeShow = ko.observable(false)    ;

model.selectedScenario = ko.observable(-1).extend({ session: 'selectedScenario' });

var objectivesToActivate =  ko.observable(-1).extend({ session: 'activeObjectives' });

objectivesToActivate(-1)

model.scenarioCommanderSpec = "";
                              
model.selectedCommanderSpec = ko.observable("/pa/units/commanders/raptor_rallus/raptor_rallus.json").extend({ session: 'selectedCommanderSpec' });

model.selectedCommander = ko.computed(function () {
    // If we haven't gotten a commander list yet, just return nothing'.
    if (!model.commanders() || !model.commanders().length)
        return null;

    var index = model.selectedCommanderIndex();

    if (index === -1) { /* if nothing is selected, either use the preferred cmdr or the first cmdr in the list */
        if (model.preferredCommanderValid()){

            var commander = model.preferredCommander();
            if (_.has(commander, 'UnitSpec')){
                if(model.annihilationModeShow() == true){
                    
                      model.send_message('update_commander',
                     {
                         commander: model.scenarioCommanderSpec
                     }); _.delay(fixComImage,200)
                }

                model.selectedCommanderSpec(commander.UnitSpec);
                return commander.UnitSpec;
            }
            else{
                if(model.annihilationModeShow == true){
                    model.send_message('update_commander',
                    {
                        commander: model.scenarioCommanderSpec
                    });
                     _.delay(fixComImage,200)
                     
                     model.selectedCommanderSpec(model.preferredCommander());
                }
                return commander;
            }
        }
        index = 0;
    }

    model.selectedCommanderSpec(model.commanders()[index]);
    if(model.commanders()[index] == "/pa/units/commanders/scenario_invincible_com/scenario_invincible_com.json"){model.selectedCommanderSpec("/pa/units/commanders/raptor_rallus/raptor_rallus.json");return "/pa/units/commanders/raptor_rallus/raptor_rallus.json"}
 
    return model.commanders()[index];
});

model.setCommander = function (index) {
    if (model.thisPlayerIsReady())
        return;

    model.selectedCommanderIndex(index % model.commanders().length);

    if(model.annihilationModeShow() == false){
        console.log("setting selected com")
        console.log(model.selectedCommander())
    model.send_message('update_commander',
    {
        commander: model.selectedCommander()
    });
    
}
    else{
        console.log("setting special com")
        model.send_message('update_commander',
        {
            commander: model.scenarioCommanderSpec
        });
        _.delay(fixComImage,200)
    }
}

function fixComImage(){

    for(i in model.armies()){
    for(j in model.armies()[i].slots()){
        
        if(model.armies()[i].slots()[j].containsThisPlayer()){
            console.log("fixing commander")
            model.armies()[i].slots()[j].commander(model.selectedCommander())

        }

    }

}
}


  model.annihilationModeToggle = function()
    {
        if ( ! model.isGameCreator() )
        {
            return;
        }

        model.annihilationModeShow( ! model.annihilationModeShow() );
        if(model.annihilationModeShow() == true){model.sandbox(true)}
        else{model.sandbox(false)}
        model.changeSettings()
        model.commanderPrep()
    }

$('div.section.game_mode').append(

    '<style> .show {display: block;} #scenarioName:hover{font-weight:bold}#scenarioName{border-style: solid solid solid solid} </style>'+
   '<div class="dropdown">'+
 ' <button onclick="dropdownScenario()" class="dropbtn">Scenarios</button>'+
  '<div id="dropdownScenario" class="dropdown-content">'+
   ' <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">'+
  
    '</div>'+
    '</div> '
    
    );

$('div.section.game_mode').append(

        '<style> .show {display: block;} #scenarioName:hover{font-weight:bold}#scenarioName{border-style: solid solid solid solid} </style>'+
       '<div class="dropdown">'+
     '<button onclick="dropdownDescription()" class="dropbtn">Scenario Description</button>'+
      '<div id="dropdownDescription" class="dropdown-content">'+
        '</div>'+
        '</div> '
        
        );

        
$('div.section.game_mode').append(

    '<style> .show {display: block;} #scenarioName:hover{font-weight:bold}#scenarioName{border-style: solid solid solid solid} </style>'+
    '<div class="dropdown">'+
    ' <button onclick="dropdownSetup()" class="dropbtn">Scenario Setup</button>'+
    '<div id="dropdownSetup" class="dropdown-content">'+
    '</div>'+
    '</div> '
    
    );        





var gameBar = document.getElementById("game-bar")
var scenarioName =  document.createElement('div')
scenarioName.id = "scenario_name"
scenarioName.innerText = "No scenario has been loaded"

gameBar.appendChild(scenarioName)





var populateScenarios = function(){

    $.getJSON('coui:/mods/scenarios/scenario_list.json').then(function(imported) {
        
        try{
    imported.scenarios.push("None")

    var scenarioCount = imported.scenarios.length;
    var scenarioList = document.getElementById("dropdownScenario");

    for(var i = 0;i<scenarioCount;i++){
        var scenarioName = imported.scenarios[i]
        var appendString = document.createElement('div')
        var scenarioHtml = "<div data-bind='disabled: !model.isGameCreator()'>"+"<div id = 'scenarioName' onclick='model.setScenario("+'"'+scenarioName+'"'+")'>"+scenarioName+"</div></div>"
        appendString.innerHTML = (scenarioHtml)
        scenarioList.appendChild(appendString)

    }   
       
     }
     catch(err){console.log(err)}
 
     });

}

populateScenarios()

function initialCommanderSet(){

    model.send_message('update_commander',
    {
        commander: model.scenarioCommanderSpec
    }); _.delay(fixComImage,200)

}

function setAICommanders(commander){
    var armies = model.armies()
    for(armyIndex in armies){
        var army = armies[armyIndex]
        for(slotIndex in army.slots()){
            var slot = army.slots()[slotIndex]
            if(slot.ai() == true && slot.commander() !== commander){
                
            model.send_message('set_ai_commander',
            {
                id: slot.playerId(),
                ai_commander: commander
            });
            }
        }
    }

}

model.setScenario = function(scenarioName){//there may be issues with people being unreadied, I know that altering the ai's commander does that, so need to check things like that before re setting them
    if(scenarioName == "None"){document.getElementById("scenario_name").innerHTML = "No scenario has been loaded"}
    else{
        document.getElementById("scenario_name").innerHTML= " Scenario "+scenarioName +" is active <br>(please read the setup/description)"
      
        $.getJSON('coui:/mods/scenarios/'+scenarioName+'.json').then(function(imported) {
            if(imported.aiComRequired == true){//sets all ai's commanders to the selected com upon scenario load if they are not already
                setAICommanders(imported.aiCommander)
            }
            if(imported.requireSandbox == true){model.sandbox(true)}
            if(imported.annihilation == true){model.annihilationModeToggle(); model.annihilationModeShow(true)}
            if(imported.customCommander !== undefined){model.scenarioCommanderSpec = imported.customCommander; _.delay(initialCommanderSet,1000)}

            var scenarioDescription = document.getElementById("dropdownDescription");
            var scenarioSetup = document.getElementById("dropdownSetup");
            
            if(imported.setup !== undefined){
                scenarioSetup.innerText = imported.setup
            }
            else{
                scenarioSetup.innerText = 'No setup listed'
            }

            if(imported.description !== undefined){
                scenarioDescription.innerText = imported.description
            }
            else{
                scenarioDescription.innerText = 'No description listed'
            }


            scenarioDescription.innerText = imported.description
        })
    }
    model.selectedScenario(scenarioName)
    if(model.isGameCreator()){_.delay(model.updatePlayersScenario,500)}

}

function dropdownScenario() {

  if(document.getElementById("dropdownScenario").style.display !== "none"){ document.getElementById("dropdownScenario").style.display = "none"}
  else{if(!model.isGameCreator()){return} document.getElementById("dropdownScenario").style.display = ""}
  
}
function dropdownDescription() {

    if(document.getElementById("dropdownDescription").style.display !== "none"){ document.getElementById("dropdownDescription").style.display = "none"}
    else{document.getElementById("dropdownDescription").style.display = ""}
    
  }
  function dropdownSetup() {

    if(document.getElementById("dropdownSetup").style.display !== "none"){ document.getElementById("dropdownSetup").style.display = "none"}
    else{document.getElementById("dropdownSetup").style.display = ""}
    
  }
dropdownScenario()
dropdownDescription()
dropdownSetup()


function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("div");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

//function here to set players com to invincible com if toggle ticked

model.commanderPrep =function(){
    var modeActive = model.annihilationModeShow()
    console.log("running")
    if(modeActive == true){

        model.send_message('update_commander',
        {
            commander: model.scenarioCommanderSpec
        });
        _.delay(fixComImage,200)
       
    }
    
    else{

        model.send_message('update_commander',
             {
            commander: model.selectedCommander()

            })
            
        }


}

var scenariosIdentifier = "scenarios"


model.loadScenario = function(scenario){

model.scenarioCommanderSpec = scenario.customCommander
if(model.scenarioCommanderSpec == undefined){model.scenarioCommanderSpec = ""}
model.setScenario(scenario)


}

model.updatePlayersScenario = function(){
    var currentScenario = model.selectedScenario()
    var data  = {};
    data.identifier = scenariosIdentifier;
    data.chosenScenario = currentScenario
    data.type = "updateScenario"
    model.send_message("json_message", data);
}

var scenarioHandler = function(msg)
{
    console.log(msg)
    var data = msg.payload;

    if (!data)
        return;

    if (model.isGameCreator())
    {
        switch (data.type)
        {

// new player needs scenario
        case 'new':

            model.updatePlayersScenario();

            break;

// ignore our own messages
        case 'updateScenario':
                console.log("updating scenario but HOST")
            break;

        default:
            console.error('scenarios unknown host custom message');
            console.error( JSON.stringify( data ) );
            break;
        }
    }
    else
    {
        switch (data.type)
        {
// host is sending scenario to players
        case 'updateScenario':
            console.log("updating scenario")
            console.log(data.chosenScenario)
            if (data.chosenScenario !== "")
            {
              model.selectedScenario(data.chosenScenario)
              model.loadScenario(model.selectedScenario())
            }

            break;
            
        }
    }
};

model.registerJsonMessageHandler( scenariosIdentifier, scenarioHandler );


//looping updating the scenario so players joining get it and I can define it ahead of time


function loopedScenarioUpdate(){
    _.delay(model.updatePlayersScenario,500)
    _.delay(loopedScenarioUpdate, 10000)

}
loopedScenarioUpdate()
