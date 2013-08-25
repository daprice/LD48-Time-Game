ig.module(
	'game.entities.timetraveler'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTimetraveler = ig.Entity.extend({
	
	// Set some of the properties
	collides: ig.Entity.COLLIDES.ACTIVE,
	type: ig.Entity.TYPE.A,
	
	size: {x: 10, y: 45},
	offset: {x:3, y:0},
	health: 50,
	moveVel: {y: 100, x:100},
	moveAccel: {y: 20, x: 20},
	jumpVel: 285,
	maxVel: {y: 2000, x: 500},
	
	direction: 'right',
	
	// Load an animation sheet
	animSheet: new ig.AnimationSheet( 'media/timetraveler.png', 15, 45 ),
	
	init: function( x, y, settings ) {
		// Add animations for the animation sheet
		this.addAnim( 'idle_right', 0.25, [0,1,2,0] );
		this.addAnim( 'idle_left', 0.25, [3,4,5,3] );
		this.addAnim( 'walk_right', 0.08, [8,9,10,11] );
		this.addAnim( 'walk_left', 0.08, [12,13,14,15] );
		this.addAnim( 'jump_right', 1, [6] );
		this.addAnim( 'jump_left', 1, [7] );
		this.addAnim( 'warpOut_right', 0.08, [16,17,18,19], true );
		this.addAnim( 'warpOut_left', 0.08, [21,22,23,24], true );
		this.addAnim( 'warpIn_right', 0.08, [19,18,17,16], true );
		this.addAnim( 'warpIn_left', 0.08, [24,23,22,21], true );
		
		//check settings
		if (settings.direction == 'left') this.direction = 'left';
		else if (settings.direction == 'right') this.direction = 'right';
		
		this.currentAnim = this.anims['warpIn_'+this.direction];
		this.warpingIn = true;
		
		// Call the parent constructor
		this.parent( x, y, settings );
		
		//set up input
		this.frames = settings.frames || new Array();
		this.warpOnFrame = settings.warpOnFrame || -1;
		this.currentFrame = 0;
		if (this.name == "player") {
			this.inputState = function(inputName) {return ig.input.state(inputName);};
		}
		else {
			this.inputState = function(inputName) {
				if (this.frames[this.currentFrame])
					return this.frames[this.currentFrame][inputName];
				else
					return false;
			}.bind(this);
		}
	},
    
	update: function() {
		// This method is called for every frame on each entity.
		// React to input, or compute the entity's AI here.
		this.currentFrame++;
		
		//save user input if this is a user
		if (this.name == 'player') {
			if (this.inputState('jump') || this.inputState('left') || this.inputState('right'))
				/*if (this.frames[this.currentFrame] === undefined)
					this.frames[this.currentFrame] = {jump:undefined, left:undefined, right:undefined};
				this.frames[this.currentFrame].jump = this.inputState('jump');
				this.frames[this.currentFrame].left = this.inputState('left');
				this.frames[this.currentFrame].right = this.inputState('right');*/
				this.frames[this.currentFrame] = {jump: this.inputState('jump'), left: this.inputState('left'), right: this.inputState('right')};
		}
		
		//react to any input (user or stored)
		if (!this.warpingOut && !this.warpingIn) {
			if (this.inputState('jump')) { this.jump(); }
			var idle = true;
			if (this.inputState('left')) { this.moveLeft(); idle = false; }
			else if (this.inputState('right')) { this.moveRight(); idle = false; }
			if (idle == true) this.idle();
			
			if (!this.standing) {
				this.currentAnim = this.anims['jump_'+this.direction];
			}
		}
		
		//warp out if set to do so
		if (this.warpOnFrame == this.currentFrame) {
			this.warpOut();
		}
		
		//finish in-progress warps if necessary
		if (this.warpingIn) {
			if (this.currentAnim.loopCount >= 1) {
				this.warpingIn = false;
				this.currentAnim = this.anims['idle_'+this.direction];
			}
		}
		
		if (this.warpingOut) {
			if (this.currentAnim.loopCount >= 1) {
				this.kill();
			}
		}
		
		// Call the parent update() method to move the entity
		// according to its physics
		this.parent(); 
	},
	
	warpOut: function() {
		this.currentAnim = this.anims['warpOut_'+this.direction].rewind();
		this.warpOnFrame = this.currentFrame;
		this.warpingOut = true;
	},
	
	jump: function() {
		if (this.standing) { //only jump if on ground
			this.vel.y = -this.jumpVel;
			this.currentAnim = this.anims['jump_'+this.direction];
		}
	},
	
	moveLeft: function() {
		if (this.vel.x > -this.moveVel.x)
			this.vel.x += -this.moveAccel.x;
		if (this.vel.x < -this.moveVel.x)
			this.vel.x -= -this.moveVel.x;
		this.direction = 'left';
		if (this.standing) {
			this.currentAnim = this.anims.walk_left;
		}
	},
	
	moveRight: function() {
		if (this.vel.x < this.moveVel.x)
			this.vel.x += this.moveAccel.x;
		if (this.vel.x > this.moveVel.x)
			this.vel.x -= this.moveVel.x;
		this.direction = 'right';
		if (this.standing) {
			this.currentAnim = this.anims.walk_right;
		}
	},
	
	idle: function() {
		if (this.vel.x > 0)
			this.vel.x -= this.moveAccel.x;
		if (this.vel.x < 0)
			this.vel.x += this.moveAccel.x;
		if (this.vel.x <= 2*this.moveAccel.x)
			this.vel.x = 0;
		if (this.standing) {
			this.currentAnim = this.anims['idle_'+this.direction];
		}
	}
});

});