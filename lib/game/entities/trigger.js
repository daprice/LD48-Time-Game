ig.module(
	'game.entities.trigger'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTrigger = ig.Entity.extend({
	
	// Set some of the properties
	collides: ig.Entity.COLLIDES.NEVER,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	
	size: {x: 16, y: 16},
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',
	
	target: null,
	times: null,
	timesUsed: 0,
	active: false,
	
	init: function( x, y, settings ) {
		
		// Call the parent constructor
		this.parent( x, y, settings );
		
		if (this.times == null)
			this.times = -1;
		
		this.targetedEntity = ig.game.getEntityByName(this.target);
	},
    
	update: function() {
		if ((this.times == -1 || this.timesUsed < this.times) && ig.game.getEntityByName('player') && this.touches(ig.game.getEntityByName('player'))) {
			if (this.active == false) {
				this.active = true;
			}
			else
				return;
			
			if (this.target == 'pauseTimewarps') {
				ig.game.pauseTimewarps();
			}
			else if (this.target == 'resumeTimewarps') {
				ig.game.resumeTimewarps();
			}
			else if (this.target == 'hideWatch') {
				ig.game.drawPocketwatch = false;
			}
			else if (this.target == 'showWatch') {
				ig.game.drawPocketwatch = true;
			}
			else this.targetedEntity.activated = true;
		}
		else {
			if (this.active == true) {
				this.timesUsed++;
				this.active = false;
			}
			else
				return;
			
			if (this.target == 'pauseTimewarps') {
				return;
			}
			else if (this.target == 'resumeTimewarps') {
				return;
			}
			else if (this.target == 'hideWatch') {
				return;
			}
			else if (this.target == 'showWatch') {
				return;
			}
			else this.targetedEntity.activated = false;
		}
		
		// Call the parent update() method to move the entity
		// according to its physics
		this.parent(); 
	}
});

});