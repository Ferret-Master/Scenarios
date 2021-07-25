/**
 * string.padStart pollyfill from https://github.com/behnammodi/polyfill/blob/master/string.polyfill.js
 * Can be removed once Coherent UI is updated, like, at all.
 */
if (!String.prototype.padStart) {
    Object.defineProperty(String.prototype, "padStart", {
        configurable: true,
        writable: true,
        value: function (targetLength, padString) {
            targetLength = targetLength >> 0; // floor if number or convert non-number to 0;
            padString = String(typeof padString !== "undefined" ? padString : " ");
            if (this.length > targetLength) {
                return String(this);
            } else {
                targetLength = targetLength - this.length;
                if (targetLength > padString.length) {
                    padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
                }
                return padString.slice(0, targetLength) + String(this);
            }
        },
    });
}

handlers.objectiveUpdate = function(payload) {
    if (!model.alreadyMadeFrame) {
        var toggleImage = function(open) {
            return open ? 'coui://ui/main/shared/img/controls/pin_open.png' : 'coui://ui/main/shared/img/controls/pin_closed.png';
        };

        model.alreadyMadeFrame = ko.observable(true);
        model.pinScenarioPanel = ko.observable(true);
        model.togglePinScenarioPanel = function () { model.pinScenarioPanel(!model.pinScenarioPanel()); };
        model.showScenarioPanel = ko.computed(function () { return model.pinScenarioPanel() });
        model.scenarioPanelToggleImage = ko.computed(function() { return toggleImage(model.showScenarioPanel()); });

        createFloatingFrame("scenario_frame", 500, 250, { "snap": false, "top": 42, "rememberPosition": "false" });//this top offset is so player bar with eco mods doesn't overlap

        $.get("coui://ui/mods/scenario-ui/objective_ui_live_game.html", function (html) {
            var $html = $(html);
            $("#scenario_frame_content").append($html);
            ko.applyBindings(model, $html[0]);
        });
    }

    payload.forEach(function(objective, i) {
        if (!objective.visible) {
            $("#objectivesList li:nth-child(" + (i + 1) + ")").hide();
            return;
        }

        $("#objectivesList li:nth-child(" + (i + 1) + ")").show();

        if (objective.description !== undefined) {
            $("#objectivesList li:nth-child(" + (i + 1) + ") .description").text(objective.description);
        }

        if (objective.progress !== undefined) {
            // Currently disabled as no scenarios use the "king" syntax, and this probably doesn't work / is outdated
            // if (objective.syntax === "king") {
            //     var finalString = "";
            //     var topPlayerString = "";
            //     var highestNum = 0;
            //     var playerName = payload[i].playerName;
            //     var playerNumber = 0;
            //
            //     for(var j = 0; j < array[i].length; j++){
            //         if (array[i][j] > highestNum) {
            //           highestNum = array[i][j]; topPlayerString = payload[0].playerNames[j]
            //         }
            //
            //         if (playerName === payload[0].playerNames[j]) {
            //           playerNumber = array[i][j];
            //         }
            //     }
            //
            //     finalString += (playerName + ":" + playerNumber + "\r\n" + "Leader:" + topPlayerString + " with " + highestNum);
            //
            //     $(".progress" + visibleObjectiveIndex).html(finalString);
            // } else {

            $("#objectivesList li:nth-child(" + (i + 1) + ") .progress .current").text(objective.progress);

            var percentComplete = 100 / objective.needed * objective.progress;

            $("#objectivesList li:nth-child(" + (i + 1) + ") .progress_bar_progress").width(percentComplete + "%");
        }

        if (objective.syntax !== "king") {
            $("#objectivesList li:nth-child(" + (i + 1) + ") .progress .syntax").text(objective.syntax);
        }

        if (objective.needed !== undefined) {
            $("#objectivesList li:nth-child(" + (i + 1) + ") .progress .needed").text(objective.needed);
        }

        if (objective.result !== undefined) {
            $("#objectivesList li:nth-child(" + (i + 1) + ") .result").text(objective.result);
        }
    });
};

handlers.scenarioDetails = function(payload) {
    $("#scenarioAuthor").html(payload[0]);
    $("#scenarioName").html(payload[1] + " by ");
}

function secondsToTime(e) {
    var h = Math.floor(e / 3600),
        m = Math.floor(e % 3600 / 60),
        s = Math.floor(e % 60);

    h = h ? (h.toString() + ":") : ""; // Only show hours if needed, and don't pad
    m = m.toString().padStart(2, "0") + ":";
    s = s.toString().padStart(2, "0");

    return h + m + s;
}

//updates the ingame clock on the scenario ui
handlers.scenarioTime = function(payload) {
    $("#landingTime").text(secondsToTime(payload));
}

handlers.scenarioWave = function(payload) {
    if (model.waveTime === undefined || model.waveTime > payload.waveInterval) {
        model.waveTime = payload.waveInterval;
    }

    if (model.waveTime < payload.waveInterval) {
        return;
    }

    $("#waveTime").text(secondsToTime(payload.waveInterval - Math.round(payload.elapsedTime % payload.waveInterval)));
}
