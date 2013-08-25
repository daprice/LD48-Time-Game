ig.module(
	'game.entities.pocketwatch'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPocketwatch = ig.Entity.extend({
	
	// Set some of the properties
	collides: ig.Entity.COLLIDES.NEVER,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	
	size: {x: 16, y: 14},
	
	animSheet: new ig.AnimationSheet( 'media/pocketwatch_ground.png', 16, 14 ),
	
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
		this.kill();
	}
});

});