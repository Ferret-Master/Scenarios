//overhaul uses hive mode as a base but requires different internals so will be seperate file wise


//for central control can either make it regular update based or detect disconnects
function controllerMissing(){//if assumed controller has not sent out update in x time set yourself to controller if your uptime is highest

}

function updateController(){//each player messages relevant info in chat that controller adds to game state, will loop every few seconds

}

function updatePlayers(){//controller sends out a json copy of the current gamestate that each player then adopts to update ui/behaviour, will loop fairly often

}

function sendCommandToPlayers(){//director events need to be communicated to players to trigger puppets/ui stuff

}

function notEmpty(){}