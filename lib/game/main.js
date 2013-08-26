ig.module( 
	'game.main' 
)
.requires(
	//'impact.debug.debug',
	'impact.game',
	'impact.font',
	
	'game.entities.timetraveler',
	'game.entities.pocketwatch',
	'game.entities.hammer',
	'game.entities.powerup',
	'game.entities.dialogue',
	'game.entities.trigger',
	
	'game.levels.tutorial'
)
.defines(function(){

ig.Sound.use = [ig.Sound.FORMAT.MP3, ig.Sound.FORMAT.OGG]; //fix loading stall in safari

var FRAME_RATE = 30;
var timestep = 1/FRAME_RATE;

var WINDOW_WIDTH = 450;
var WINDOW_HEIGHT = 300;

//set fixed time step so physics will be deterministic
ig.Timer.step = function() {
	ig.Timer.time += timestep;
};

ig.Timer.inject({
    tick: function() {
        return timestep;
    }
});

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	pocketwatch: new ig.Image( 'media/pocketwatch.png' ),
	pocketwatchHand: new ig.AnimationSheet( 'media/watchhand.png', 4, 8 ),
	
	warpOutSound: new ig.Sound('media/sound/timewarp.*', false),
	
	gravity: 800,
	
	timetravelerInstances: new Array(),
	timewarpInProgress: false,
	timeBetweenWarps: 10,
	drawPocketwatch: true,
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind(ig.KEY.A, 'left');
		ig.input.bind(ig.KEY.D, 'right');
		ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
		
		ig.input.bind(ig.KEY.SPACE, 'jump');
		
		this.watchhand = new ig.Animation(this.pocketwatchHand, 1, [0]);
		this.watchhand.pivot.y = 6;
		
		ig.music.add('media/sound/ticktock.*');
		ig.music.loop = true;
		ig.music.volume = 0.75;
		
		this.loadLevel(LevelTutorial);
		
		var levelinfo = this.getEntityByName('levelinfo');
		this.playerstart = {x: levelinfo.playerposx, y: levelinfo.playerposy};
		
		this.warpTimer = new ig.Timer(this.timeBetweenWarps);
		
		ig.music.play();
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
		var player = this.getEntityByName('player');
		if (player) {
			this.screen.x = player.pos.x - WINDOW_WIDTH/2;
			if (this.screen.x < 0) this.screen.x = 0;
			this.screen.y = player.pos.y - WINDOW_HEIGHT/2 - 30;
		}
		
		//if a timewarp was started and the timetravelers are done warping out, warp them back in in their earlier positions
		if (this.timewarpInProgress == true && this.getEntitiesByType('EntityTimetraveler').length == 0) {
			this.finishTimewarp();
		}
		
		//check to see if it's time to start a timewarp
		if (this.warpTimer.delta() >= 0 && !this.timewarpInProgress) {
			this.timewarp();
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		if (this.drawPocketwatch) {
			this.pocketwatch.draw(10,10);
			var secondsElapsed = Math.floor((this.timeBetweenWarps - this.warpTimer.delta()) % 10);
			this.watchhand.angle = 2*Math.PI - 2*Math.PI * (secondsElapsed / 10);
			this.watchhand.draw(19,23);
		}
	},
	
	addTenSeconds: function() {
		this.timeBetweenWarps += 10;
		
		var remainingTime = Math.abs(this.warpTimer.delta());
		var newTime = remainingTime + 10;
		this.warpTimer.set(newTime);
	},
	
	pauseTimewarps: function() {
		this.warpTimer.pause();
		ig.music.pause();
	},
	
	resumeTimewarps: function() {
		this.warpTimer.unpause();
		ig.music.play();
	},
	
	timewarp: function() {
		//kill all timetravelers in the scene
		var timetravelers = this.getEntitiesByType("EntityTimetraveler");
		for (var i = 0; i < timetravelers.length; i++) {
			timetravelers[i].warpOut();
		}
		
		//save player's actions to latest instance
		this.timetravelerInstances.push({startpos:ig.copy(this.getEntityByName('player').startpos), frames:ig.copy(this.getEntityByName('player').frames), warpOnFrame:this.getEntityByName('player').warpOnFrame });
		
		this.timewarpInProgress = true;
		
		ig.music.stop();
		this.warpOutSound.play();
	},
	
	finishTimewarp: function() {
		//respawn all previous timetravelers as AI
		for (var i = 0; i < this.timetravelerInstances.length; i++) {
			this.spawnEntity('EntityTimetraveler', this.timetravelerInstances[i].startpos.x, this.timetravelerInstances[i].startpos.y, {frames:this.timetravelerInstances[i].frames, warpOnFrame: this.timetravelerInstances[i].warpOnFrame});
		}
		
		//spawn a new player timetraveler
		this.spawnEntity('EntityTimetraveler', this.playerstart.x - (this.timetravelerInstances.length * 17), this.playerstart.y, {name:'player'});
		this.timewarpInProgress = false;
		
		//prepare for another time warp
		this.warpTimer.set(this.timeBetweenWarps);
		
		ig.music.play();
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, FRAME_RATE, WINDOW_WIDTH, WINDOW_HEIGHT, 2 );

});
