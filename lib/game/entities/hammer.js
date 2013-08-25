ig.module(
	'game.entities.hammer'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityHammer = ig.Entity.extend({
	
	// Set some of the properties
	collides: ig.Entity.COLLIDES.NEVER,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	
	size: {x: 16, y: 13},
	
	animSheet: new ig.AnimationSheet( 'media/randomhammer.png', 16, 13 ),
	
	init: function( x, y, settings ) {
		this.addAnim( 'idle', 1, [0] );
		
		// Call the parent constructor
		this.parent( x, y, settings );
	},
    
	update: function() {
		
		
		// Call the parent update() method to move the entity
		// according to its physics
		this.parent(); 
	},
	
	check: function(other) {
		//this.kill();
	}
});

});