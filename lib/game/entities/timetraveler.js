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
    
    direction: 'right',
    
    // Load an animation sheet
    animSheet: new ig.AnimationSheet( 'media/timetraveler.png', 15, 45 ),
    
    init: function( x, y, settings ) {
        // Add animations for the animation sheet
        this.addAnim( 'idle_right', 0.25, [0,1,2,0] );
        this.addAnim( 'idle_left', 0.25, [3,4,5,3] );
        
        //check settings
        if (settings.direction == 'right') this.direction = 'right';
        else if (settings.direction == 'left') this.direction = 'left';
        
        // Call the parent constructor
        this.parent( x, y, settings );
    },
    
    update: function() {
        // This method is called for every frame on each entity.
        // React to input, or compute the entity's AI here.
        
        
        // Call the parent update() method to move the entity
        // according to its physics
        this.parent(); 
    }
});

});