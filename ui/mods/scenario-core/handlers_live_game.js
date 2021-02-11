var client_state = handlers.client_state; handlers.client_state = function (client) {
            
    client_state(client);

    var playerCom = "/pa/units/commanders/imperial_able/imperial_able.json"
    if (client.landing_position) {
        var players = model.players()
        for(var i = 0; i<players.length;i++){
            
            if(players[i].stateToPlayer == "self"){
                color = players[i].primary_color
             
                playerCom = players[i].commanders[0]
            }

        }
        
    
      
        
        client.landing_position.color = color;
        var landingObject ={
        
            "planet": client.landing_position.planet_index,
            "pos":[
                client.landing_position.location.x,
                client.landing_position.location.y,
                client.landing_position.location.z
            ],
            
            "playerCom": playerCom
        }


        api.Panel.message(api.Panel.pageId, 'ScenarioLandingPosition',landingObject)
       
    }

};

var commanderid = undefined;

var server_state = handlers.server_state; handlers.server_state = function(msg) { 

server_state(msg);

if (msg.data) {
    
switch (msg.state) {
    case 'landing':

        if (msg.data.client && msg.data.client.zones) {
            var zones = msg.data.client.zones;
            api.Panel.message(api.Panel.pageId, 'ScenarioLandingZones',zones)
           
        }

        
        break;



}

}



}