# Notes

Will be hopefully explaining the process of a scenario below.

1: Scenario Selected
2: Correct System/lobby for scenario selected.
3: Game loads in
4: Initial load function reads in scenario file and loads necessary data.
5: Starting objectives loaded in, any game-start triggers activated.
6: Scenario UI component enabled and displays objectives/ UI components needed.
7: whenever an Objective is complete or failed it activates a set of triggers.
7-N: triggers essentially act as an easier to set up function/API calls. A trigger may call upon some API/s, activate a new objective, or modify existing ones.
8: when the final objective is complete it will trigger, this may be used for alternative win conditions/transitions, story, or cutscenes.

Scenario Builder:

- A UI mod that allows for the creation of scenarios in game
- can create pre sets for building units/structures, create objectives, and create triggers.
- upon completion you can save a scenario file that can be used to play the scenario.
- for early builds of scenario's these will be manually made.

live game triggers can probably be an API instead as it does not need to run any loops directly or reference things.

spawn pre set function  is static. spawn_dynamic pre set has more options and less requirements.



UI:

The elements a player will want access to are:

- A list of currently active objectives
- If necessary progress towards these.
- Reward/consequance of objective. //allows for optional objectives that players will still do.

I think that space for 3-4 objectives is a good amount, with a later added arrow to cycle between them.
progress can be at the right of the objective to save space.

Later feature but hovering over objective will bring up event like cam of location/event if applicable.

Scenario name/creator near the top.

An ingame timer on it somewhere.


for multiplayer teamate progress mabye.