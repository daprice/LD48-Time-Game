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
	
	size: {x: 10, y: 45},
	offset: {x:3, y:0},
	health: 50,
	moveVel: {y: 100, x:100},
	moveAccel: {y: 20, x: 20},
	jumpVel: 250,
	maxVel: {y: 2000, x: 500},
	
	direction: 'right',
	
	currentPlayer: true,
	
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
		
		//check settings
		if (settings.direction == 'left') this.direction = 'left';
		else if (settings.direction == 'right') this.direction = 'right';
		
		this.currentAnim = this.anims['idle_'+this.direction];
		
		this.currentPlayer = settings.currentPlayer || this.currentPlayer;
		
		// Call the parent constructor
		this.parent( x, y, settings );
	},
    
	update: function() {
		// This method is called for every frame on each entity.
		// React to input, or compute the entity's AI here.
		
		//user input
		if (this.currentPlayer) {
			if (ig.input.state('jump')) this.jump();
			var idle = true;
			if (ig.input.state('left')) { this.moveLeft(); idle = false; }
			else if (ig.input.state('right')) { this.moveRight(); idle = false; }
			if (idle == true) this.idle();
		}
		
		if (!this.standing) {
			this.currentAnim = this.anims['jump_'+this.direction];
		}
		
		// Call the parent update() method to move the entity
		// according to its physics
		this.parent(); 
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
		if (this.standing) {
			this.currentAnim = this.anims['idle_'+this.direction];
		}
	}
});

});