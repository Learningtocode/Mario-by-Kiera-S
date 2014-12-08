// TODO 
game.PlayerEntity = me.Entity.extend({
    //call a constructor 
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
           image: "mario",  
           spritewidth: "128",
           spriteheight: "128", 
           width: 128, 
           height: 128, 
           getShape: function(){
               return (new me.Rect(0, 0, 30, 128)).toPolygon();
           }
        }]);   
         
        //"Stomp" is the animation for when mario is grown and is moving.
        this.renderable.addAnimation("stomp", [14, 15, 16, 17, 18, 19], 80);
        //define a idle animation (using a frame)
        this.renderable.addAnimation("idle", [3]); 
        this.renderable.addAnimation("bigIdle", [19]);
        //define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk", [8, 9, 10, 11, 12, 13], 80);
         //set the idle animation as defult    
        this.renderable.setCurrentAnimation("idle");     
            
        //This makes sures that the settings above are not activated when the milk is consume.
        this.big = false;
        // The code below is the set speed of Mario.
        this.body.setVelocity(5, 20);
        //set display that follows the charater on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    }, 
    
    //Player press the right key, Mario moves right. 
    //The first part of code for line 20 is the current speed Mario is going adding to the speed it's suppose to be at (the second part). 
    //The me.timer.tick make sures the walking movement of Mario is accurate to the speed it's going.
     
    update: function(delta) {
        if (me.input.isKeyPressed("right")) {
            // unflips the sprite
            this.flipX(false);
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (me.input.isKeyPressed("left")) {
            // flip the sprite on the horizontal axis
            this.flipX(true);
            //updates the entity velocity so basically the charater is walking right now... 
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            this.body.vel.x = 0;
            //change to the standing animation
            this.renderable.setCurrentAnimation("idle");
        }
          
        if(!this.big){
        if(this.body.vel.x !== 0){  
           if(!this.renderable.isCurrentAnimation("walk")) {
            this.renderable.setCurrentAnimation("walk"); 
             this.renderable.setAnimationFrame();
            }
     }else{   
          this.renderable.setCurrentAnimation("idle"); 
        }  
    }else{
       if(this.body.vel.x !== 0){  
           if(!this.renderable.isCurrentAnimation("stomp")) {
            this.renderable.setCurrentAnimation("stomp"); 
             this.renderable.setAnimationFrame();
            }
     }else{   
          this.renderable.setCurrentAnimation("bigIdle"); 
        }  
    } 
    
         
        if(me.input.isKeyPressed("up")){
            // make sure we are not already falling or jumping 
            if(!this.body.jumping && !this.body.falling){
               //set the jumping flag
                this.body.jumping = true;
               // set current vel to the maximum defined value 
              // Then let gravity do the rest 
              this.body.vel.y == this.body.accel.y * me.timer.tick;       
            }
        } 
         
         this.body.update(delta);
         me.collision.check(this, true, this.collideHandler.bind(this), true);
           
         
        //Changes where Mario is on screen. 
        
        this._super(me.Entity, "update", [delta]);
        return true;
    }, 
    
    collideHandler: function(response){
        //ydif is the difference in position between mario and whatever he hit so we can see if he jump on something.  
        // b represents what we are running into 
        var ydif = this.pos.y response.b.pos.y;
   
        if(response.b.type === 'badguy'){ 
            if(ydif <= -115){
               response.b.alive = false;
            }else{
           me.state.change(me.state.MENU);
        }else if(response.b.type === 'milk'){
            this.big = true; 
        //Response.b represents the Mushroom or in this case milk 
            me.game.world.removeChild(response.b);
        }
         
    }
    
}); 
 
game.LevelTrigger = me.Entity.extend({
     init: function(x, y, settings){
         this._super(me.Entity, 'init', [x, y, settings]); 
         this.body.onCollision = this.onCollision.bind(this); 
         this.level = settings.level; 
         this.xSpawn = settings.xSpawn; 
         this.ySpawn = settings.ySpawn;
     },   
      
     onCollision: function(){
         this.body.setCollisionMask(me.collision.types.NO_OBJECT); 
         me.levelDirector.loadLevel(this.level); 
         me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
     }
     
}); 
 
game.BadGuy = me.Entity.extend({
     init: function(x, y, settings){
          this._super(me.Entity, 'init', [x, y, {
           image: "slime",  
           spritewidth: "60",
           spriteheight: "28", 
           width: 60, 
           height: 28, 
           getShape: function(){
               return (new me.Rect(0, 0, 60, 28)).toPolygon();
           }
        }]);  
     
        this.spritewidth = 60; 
        var width = settings.width;
        x = this.pos.x; 
        this.startX = x; 
        this.endX = x + width - this.spritewidth;
        this.pos.x = x + width -this.spritewidth; 
        this.updateBounds(); 
         
        this.alwaysUpdate = true; 
         
        this.walkLeft = false; 
        this.alive = true; 
        this.type = "badguy";
          
    //  this.renderable.addAnimation("run", [0, 1, 2], 80);
    //  this.renderable.setCurrrentAnimation("run");
       
    // Mario can't move withoutt any Velocity.
        this.body.setVelocity(4, 6);
      
     }, 
       
    update: function(delta){
        this.body.update(delta); 
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
       //Direction of movement of Bad Guy
       if(this.alive){
           if(this.walkLeft && this.pos.X <= this.startX){ 
               this.walkLeft = false;
            }else if(!this.walkLeft && this.pos.x >= this.endX){
                this.walkLeft = true; 
            }  
            //Control animation to walk left; setting our varible
            this.flipX(!this.walkLeft); 
            //Tell the body how to move. If this is true, then we will have the charater do the code after the question mark. 
            //The code with "-this" mmeans we're going left and the code after the colon means the charater is going right.
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
                
       }else{ 
           //removeChild removes charater out game
           me.game.world.removeChild(this);
       }
      
        this._super(me.Entity, "update", [delta]); 
        return true;
    }, 
     
    collideHandler: function(){
        
    }
     
 }); 
  

game.milk = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "milk",
                spritewidth: "60",
                spriteheight: "68",
                width: 60,
                height: 68,
                getShape: function() {
                    return (new me.Rect(0, 0, 60, 68)).toPolygon();
                }
            }]); 
        //Charater can collide with milk 
        me.collision.check(this); 
        this.type = "milk";
    }

});