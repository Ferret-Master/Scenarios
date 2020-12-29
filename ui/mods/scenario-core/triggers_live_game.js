//all trigger types will be stored within a trigger api file. makes it easy to use.

function TriggerViewModel() {

    var self = this;

    self.allTriggers = ([]);//used to pre assemble api needed at start of match rather than every time.

    self.allTriggernames = ([]);//names for reference in other functions.

    self.nonObjectiveTriggers = ([]);//these triggers are caused by non objectives. e.g system loaded, spawned in, or pure time delays.


}

var scenarioTriggerModel = new TriggerViewModel();

model.setupTriggers = function(triggerArray){
    console.log("trigger setup started")
    console.log(triggerArray)
    if(scenarioTriggerModel){
    for(var i = 0;i<triggerArray.length;i++){

        scenarioTriggerModel.allTriggers[i] = triggerArray[i];
        scenarioTriggerModel.allTriggernames[i] = triggerArray[i].name;
    }
    }
}

model.activateTrigger = function(triggerName){ //this prevents creators breaking things by calling triggers with no defined values.
    console.log("activate trigger called with value "+triggerName)
    for(var i = 0;i<scenarioTriggerModel["allTriggernames"].length;i++){
        if(scenarioTriggerModel.allTriggernames[i] == triggerName){



        }
    }
    return "no trigger of that name was defined"

}

// handlers.setupTriggers = function(payload) {
//     console.log("setup triggers called with "+ payload)
//     triggerModel.allTriggers = payload;
    
// };

// handlers.activateTrigger = function(payload) {
//     console.log("activating trigger "+ payload)
//     triggerModel.allTriggers = payload;
    
// };