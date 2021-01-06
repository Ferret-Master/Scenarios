# Format for scenario json files

This format will be shown here via a small example json hopefully showing all features with comments when needed

Objectives will be processed bottom up. All objectives will be listed along with what ones are available at the start. An objective being finished can unlock another objective.

If an objective is finished it can activate several triggers.

triggers are also separate and these will be distinguished by the mission_trigger: true field

A big function will read in a selected scenario from a json and use the data to set up the game.

```json

{

name: "exampleName",
description:"a tutorial",
scenarioID: 1, //used to distinguish scenarios with the same name.
systemName: "Centax-3", //scenarios will be locked to a system for the most part
author: "Ferretmaster",
gameType: "Singleplayer", //some scenarios will not work well with more people or require certain properties
playerCount: 3,
aiCount:2, //this and playercount will be checked in lobby to prevent crashes hopefully
requireBuilders:true, //this determines whether avatar fabs should be spawned in at the start of the game for each player.
requireAIBuilders:true,//determines whether the player will need to spawn in builders for the ai.
winCondition:"Default", //default is sniping commander, other could include KOTH, Assasination(killing a different units to win), or objectives, where you win after completing a certain objective

objectives: [{

name: "GameStart",
hidden: "false", //if hidden is true the objective will not be displayed to the player
description: "build some stuff",
type: "build x in area", //many objective types but they will be hardcoded
location: [{planet, pos, radius}], //this can be blank or missing values depending on what is needed.
unitType: ["exampleUnit"], //this specifies the unit/s that needs to have action taken with.
startingObjective: false, //whether this is available at the start of a match
timedSpawn: true, // if true the objective will be activated 
timedDuration: null, //this determines how long you have to complete the objective. if not complete a different set of triggers happens

successTriggers: ["spawn_metal_cache","spawn_energy_cache","camera_to_caches"], //if objective completed within given time these triggers will activate by searching through the trigger list for these names.

failureTriggers: ["trigger_enemy_nuke"],//if not completed within time triggers

successObjectives: ["control x area"], //links objectives together.
failureObjectives: ["make x fabs"]
}],

triggers:[{//in future you should be able to use array's for nearly all fields for cool things.
           // for example if you are using a trigger for ambience effects, you may want to be able to have it change effects throughout the game at particular intervals. 



name:"spawn tele effect", //the name the trigger is reffered to by objectives/other places
id : 2, //again to avoid duplicate triggers or something
activation:"landing",//used to determine when to activate triggers not linked to objectives, can be useful for regular events or timed/gamestate related ones. activation = landing ,with delay lets you set it to activate x seconds from landing.
type: "effect", //used to match a trigger to api's
location: {}, //info to pass to api's if needed
duration: {},
game_start:true,//execute on game start once avatar is spawned and id checked.
delay: 10, //time after trigger is called that it does it's effect
model: "", //if needed
duration: 10, //in the case of any visual trigger this determines how long it is displayed to the player
fbx: "", //if needed
prefab: {"planet":0,"units":[['/pa/units/land/bot_factory/bot_factory.json',[-2.0239028930664062, -36.8651123046875, -17.118804931640625],[50,50,50]]]}//buildig instructions for trigger





}]

}
```
