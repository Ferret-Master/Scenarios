handlers.ScenarioTime = function(payload) {
    console.log("time handler called with "+ payload)
    model.TimeSinceLanding = payload;
    if(landTime != 200000){

        var realtime = model.TimeSinceLanding - landTime;
        model.RealTimeSinceLanding(realtime);
    }
    
};