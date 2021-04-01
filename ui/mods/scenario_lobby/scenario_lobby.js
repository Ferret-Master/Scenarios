//this file controls everything that happens in the lobby

/*
Things it needs to do

Allow the host to select a scenario from a drop down menu(or file location)

check/modify the lobby to fit the scenario if needed(don't allow host to start if lobby doesnt work with scenario)

track and modify player commander selection if needed

currently does not work if player doesnt modify com selection, won't be an issue once scenario selection is in as it will force the selection in response


*/




model.annihilationModeShow = ko.observable(false)    ;



model.scenarioCommanderSpec = "/pa/units/commanders/scenario_invincible_com/scenario_invincible_com.json";
                              
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
    if(model.commanders()[index] == "/pa/units/commanders/scenario_invincible_com/scenario_invincible_com.json"){return "/pa/units/commanders/raptor_rallus/raptor_rallus.json"}
 
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

_.delay(function () {
    if(model.annihilationModeShow() == false){return}
    model.selectedCommander()
    model.send_message('update_commander',
        {
            commander: model.scenarioCommanderSpec
        });
        _.delay(fixComImage,200)
  },1000);
  _.delay(function () {
    if(model.annihilationModeShow() == false){return}
    model.selectedCommander()
    model.send_message('update_commander',
        {
            commander: model.scenarioCommanderSpec
        });
        _.delay(fixComImage,200)
  },5000);
  _.delay(function () {
    if(model.annihilationModeShow() == false){return}
    model.selectedCommander()
    model.send_message('update_commander',
        {
            commander: model.scenarioCommanderSpec
        });
        _.delay(fixComImage,200)
  },10000);
  _.delay(function () {
    if(model.annihilationModeShow() == false){return}
    model.selectedCommander()
    model.send_message('update_commander',
        {
            commander: model.scenarioCommanderSpec
        });
        _.delay(fixComImage,200)
  },15000);


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

$('div.section.game_mode').append('<div data-bind="visible: isGameCreator"><label data-bind="click: annihilationModeToggle"><input type="checkbox" style="pointer-events: none !important;" data-bind="checked: annihilationModeShow" /><label>Annihilation Mode</label></div>');//adds tickbox for the annhilation gamemode

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




