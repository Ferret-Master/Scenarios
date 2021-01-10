(function() {
	createFloatingFrame("scenario_frame", 400, 250, {"snap":false, "top": 42,"rememberPosition":"false"});//this top offset is so player bar with eco mods doesn't overlap
	
	
	//do a computed to show selected icon
	
	


/*
"<div class='data_util_select_opponent' data-bind='click: function() { api.select.commander(); api.camera.track(true); }'>" +
									"<img src='coui://ui/mods/ArmyUtil/floatzone/icon_si_commander.png'/>" +
									
								"</div>" +
								
								
								"<div class='status_bar_frame_commanderHP'>" +
										"<div class='status_bar_commanderHP' data-bind='style: {width: \"\" + (model.commanderHealth() * 158) + \"px\"}'></div>" +
									"</div>" +


*/

$.get("coui://ui/mods/scenario-ui/objective_ui_live_game.html", function(data){
    $("#scenario_frame").html(data);
});

$("<link/>", {
    rel: "stylesheet",
    type: "text/css",
    href: "coui://ui/mods/scenario-ui/objective_ui_live_game.css"
 }).appendTo("head");
	
	
})();
forgetFramePosition("scenario_frame");
lockFrame("scenario_frame");
//probably a better method but manually making a function per ping for now


//keeping one for reference
// model.AntiNukePing = function(){
	
// 	api.Panel.message(api.Panel.parentId,'chosenPing','antiNukePing')
// }
