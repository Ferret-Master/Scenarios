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
    if(model.commanders()[index] == "/pa/units/commanders/scenario_invincible_com/scenario_invincible_com.json" || model.commanders()[index] == "/pa/units/commanders/scenario_ai_invincible_com/scenario_ai_invincible_com.json"){model.selectedCommanderSpec("/pa/units/commanders/raptor_rallus/raptor_rallus.json");return "/pa/units/commanders/raptor_rallus/raptor_rallus.json"}

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

$(".section.game_mode").after(loadHtml("coui://ui/mods/scenario_lobby/scenario_lobby.html"));

var populateScenarios = function() {
    $.getJSON("coui:/mods/scenarios/scenario_list.json").then(function(importedScenarioList) {
        var scenarioListItemIndex = 0;
        var loadedScenarios = [];
        var scenarioSelect = $("#scenario-picker")[0];

        $.each(importedScenarioList.scenarios, function(i, scenarioFilename) {
            $.getJSON('coui:/mods/scenarios/' + scenarioFilename + '.json')
                .done(function(importedScenario) {
                    loadedScenarios.push($("<option>", {
                        value: scenarioFilename,
                        text: importedScenario.name || scenarioFilename
                    }));
                })
                .fail(function() {
                    console.error("Failed to import scenario:", scenarioFilename);
                })
                .always(function(importedScenario) {
                    if (++scenarioListItemIndex === importedScenarioList.scenarios.length) {
                        $(scenarioSelect).append($("<option>", {
                            value: "none",
                            text: "None"
                        }));

                        $.each(loadedScenarios, function(scenarioIndex, scenario) {
                            $(scenarioSelect).append(scenario);
                        });

                        scenarioSelect.dataset.bind = "enable: canChangeSettings, selectPicker: selectedScenario";
                        ko.applyBindings(model, scenarioSelect);
                    }
                });
        });
    });
}

populateScenarios();

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

//there may be issues with people being unreadied, I know that altering the ai's commander does that, so need to check things like that before re setting them
model.setScenario = function(scenarioFilename) {
    if (scenarioFilename == "none") {
        $("#scenarioFilenameWrapper").hide();
        $("#scenarioSetupWrapper").hide();
        $("#scenarioDescriptionWrapper").hide();
    } else {
        $.getJSON('coui:/mods/scenarios/' + scenarioFilename + '.json').then(function(importedScenario) {
            // Sets all ai's commanders to the selected com upon scenario load if they are not already
            if (importedScenario.aiComRequired == true) {
                setAICommanders(importedScenario.aiCommander)
                model.scenarioAiCommander = importedScenario.aiCommander
            } else {
                model.scenarioAiCommander = undefined
            }

            if (importedScenario.requireSandbox == true) {
                model.sandbox(true)
            }

            if (importedScenario.annihilation == true) {
                model.annihilationModeToggle();
                model.annihilationModeShow(true)
            }

            if (importedScenario.customCommander !== undefined) {
                model.scenarioCommanderSpec = importedScenario.customCommander;
                _.delay(initialCommanderSet, 1000);
            }

            $("#scenarioFilenameWrapper").show();
            $("#scenarioFilename").text(scenarioFilename);

            if (importedScenario.setup !== undefined) {
                $("#scenarioSetupWrapper").show();
                $("#scenarioSetup").html(importedScenario.description);
            } else {
                $("#scenarioSetupWrapper").hide();
                $("#scenarioSetup").html('');
            }

            if (importedScenario.description !== undefined) {
                $("#scenarioDescriptionWrapper").show();
                $("#scenarioDescription").html(importedScenario.description);
            } else {
                $("#scenarioDescriptionWrapper").hide();
                $("#scenarioDescription").html('');
            }
        });
    }

    model.selectedScenario(scenarioName);

    if (model.isGameCreator()) {
        _.delay(model.updatePlayersScenario, 500);
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
model.updateAi = function(){
    aiCommander = model.scenarioAiCommander;
    if (aiCommander !== undefined) {

        setAICommanders(aiCommander)
    }

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
    _.delay(model.updateAi,500)
    if (model.isGameCreator() && model.slotsAreEmpty() == false && model.selectedScenario() !== -1 && model.sandbox() == false){model.toggleSandbox()}

    _.delay(loopedScenarioUpdate, 10000)

}
loopedScenarioUpdate()
