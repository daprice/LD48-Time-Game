ig.module( 
	'game.main' 
)
.requires(
	'impact.debug.debug',
	'impact.game',
	'impact.font',
	
	'game.entities.timetraveler',
	
	'game.levels.test'
)
.defines(function(){

var FRAME_RATE = 60;
var timestep = 1 / FRAME_RATE;

//set fixed time step so physics will be deterministic
ig.Timer.step = function() {
    ig.Timer.time += timestep; // = 25fps
};

ig.Timer.inject({
    tick: function() {
        return timestep;
    }
});

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	gravity: 800,
	
	timetravelerInstances: new Array(),
	timewarpInProgress: false,
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind(ig.KEY.A, 'left');
		ig.input.bind(ig.KEY.D, 'right');
		ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
		
		ig.input.bind(ig.KEY.SPACE, 'jump');
		
		this.loadLevel(LevelTest);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
		//if a timewarp was started and the timetravelers are done warping out, warp them back in in their earlier positions
		if (this.timewarpInProgress == true && this.getEntitiesByType('EntityTimetraveler').length == 0) {
			this.finishTimewarp();
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
	},
	
	timewarp: function() {
		//kill all timetravelers in the scene
		var timetravelers = this.getEntitiesByType("EntityTimetraveler");
		for (var i = 0; i < timetravelers.length; i++) {
			timetravelers[i].warpOut();
		}
		
		//save player's actions to latest instance
		this.timetravelerInstances.push({ frames:ig.copy(this.getEntityByName('player').frames), warpOnFrame:this.getEntityByName('player').warpOnFrame });
		
		this.timewarpInProgress = true;
	},
	
	finishTimewarp: function() {
		//respawn all previous timetravelers as AI
		for (var i = 0; i < this.timetravelerInstances.length; i++) {
			this.spawnEntity('EntityTimetraveler', 72, 72, {frames:this.timetravelerInstances[i].frames, warpOnFrame: this.timetravelerInstances[i].warpOnFrame});
		}
		
		//spawn a new player timetraveler
		this.spawnEntity('EntityTimetraveler', 72, 72, {name:'player'});
		this.timewarpInProgress = false;
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
