ig.module(
	'game.entities.powerup'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPowerup = ig.Entity.extend({
	
	// Set some of the properties
	collides: ig.Entity.COLLIDES.NEVER,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	
	size: {x: 16, y: 16},
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',
	
	effect: null,
	
	init: function( x, y, settings ) {
		// Call the parent constructor
		this.parent( x, y, settings );
	},
    
	update: function() {
		
		
		// Call the parent update() method to move the entity
		// according to its physics
		this.parent(); 
	},
	
	check: function(other) {
		if (this.effect == 'addTen')
			ig.game.addTenSeconds();
		this.kill();
	}
});

});