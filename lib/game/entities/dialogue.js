ig.module(
	'game.entities.dialogue'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityDialogue = ig.Entity.extend({
	
	font: new ig.Font( 'media/04b03.font.png' ),
	
	// Set some of the properties
	collides: ig.Entity.COLLIDES.NEVER,
	type: ig.Entity.TYPE.NONE,
	
	size: {x: 16, y: 16},
	
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',
	
	activated: false,
	
	init: function( x, y, settings ) {
		this.text = settings.text;
		
		// Call the parent constructor
		this.parent( x, y, settings );
	},
    
	update: function() {
		// Call the parent update() method to move the entity
		// according to its physics
		this.parent(); 
	},
	
	draw: function() {
		if (this.activated) this.font.draw(this.text, 225, 150, ig.Font.ALIGN.CENTER);
	}
});

});