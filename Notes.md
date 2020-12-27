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
