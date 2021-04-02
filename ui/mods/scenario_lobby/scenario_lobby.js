//this file controls everything that happens in the lobby

/*
Things it needs to do

Allow the host to select a scenario from a drop down menu(or file location)

check/modify the lobby to fit the scenario if needed(don't allow host to start if lobby doesnt work with scenario)

track and modify player commander selection if needed

currently does not work if player doesnt modify com selection, won't be an issue once scenario selection is in as it will force the selection in response


*/





model.annihilationModeShow = ko.observable(false)    ;

model.selectedScenario = ko.observable("");

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

    '<style> .show {display: block;} </style>'+
   '<div class="dropdown">'+
 ' <button onclick="myFunction()" class="dropbtn">Dropdown</button>'+
  '<div id="myDropdown" class="dropdown-content">'+
   ' <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">'+
  
    '</div>'+
    '</div> '
    
    );

/* <div class="dropdown">
  <button onclick="myFunction()" class="dropbtn">Dropdown</button>
  <div id="myDropdown" class="dropdown-content">
    <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">
    <a href="#about">About</a>
    
  </div>
</div> */


// <a href="#about">About</a>

var populateScenarios = function(){
    var scenarioCount = 4;
    var scenarioList = document.getElementById("myDropdown");
    console.log(scenarioList)
    var scenarioName = "test"
    for(var i = 0;i<scenarioCount;i++){
   
        var appendString = document.createElement('div')
        scenarioName += "1"
        var pleaseWork = "<div data-bind='disabled: !model.isGameCreator()'>"+"<div data-bind='click: model.setScenario("+'"'+scenarioName+'"'+")'>"+scenarioName+"</div></div>"
        console.log(pleaseWork)
        appendString.innerHTML = (pleaseWork)
        console.log(appendString)
        scenarioList.appendChild(appendString)

    }
}

populateScenarios()

model.setScenario = function(scenarioName){

    console.log(scenarioName)

}

function myFunction() {
  
  if(document.getElementById("myDropdown").style.display !== "none"){ document.getElementById("myDropdown").style.display = "none"}
  else{ document.getElementById("myDropdown").style.display = ""}
  
}
myFunction()
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


model.loadScenario = function(Scenario){

model.scenarioCommanderSpec = Scenario.customCommander
if(model.scenarioCommanderSpec == undefined){model.scenarioCommanderSpec = ""}

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
// host is sending all ranks to players
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