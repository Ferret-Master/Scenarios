//all trigger types will be stored within a trigger api file. makes it easy to use.

function TriggerViewModel() {

    var self = this;

    self.allTriggers = ko.observable([]);//used to pre assemble api needed at start of match rather than every time.

    self.allTriggernames = ko.observable([]);//names for reference in other functions.

    self.nonObjectiveTriggers = ko.observable([]);//these triggers are caused by non objectives. e.g system loaded, spawned in, or pure time delays.


}

var triggerModel = new TriggerViewModel();

model.setupTriggers = function(triggerArray){

    if(triggerModel){
    for(var i = 0;i<triggerArray.length;i++){

        triggerModel.allTriggers[i] = triggerArray[i];
        triggerModel.allTriggernames[i] = triggerArray[i].name;
    }
    }
}

model.activateTrigger = function(triggerName){ //this prevents creators breaking things by calling triggers with no defined values.

    for(var i = 0;i<triggerModel.allTriggernames.length;i++){
        if(triggerModel.allTriggernames[i] == triggerName){



        }
    }
    return "no trigger of that name was defined"

}

handlers.setupTriggers = function(payload) {
    console.log("setup triggers called with "+ payload)
    triggerModel.allTriggers = payload;
    
};

handlers.activateTrigger = function(payload) {
    console.log("activating trigger "+ payload)
    triggerModel.allTriggers = payload;
    
};