game.EndScreen = me.ScreenObject.extend({ 
     //action to performm a state of change 
     onResetEvent: function() {
         me.game.world.removeChild(new me.Sprite(0, 0, me.loader.getImage("end-screen")), -10); 
                me.input.bindKey(me.input.KEY.ENTER, "start");  
                 
               me.game.world.addChild(new (me.Renderable.extend ({ 
                 init: function(){
                    this._super(me.Renderable, 'init', [510, 30, me.game.viewport.width, me.game.viewport.height]); 
                    this.font = new me.Font("Ariel", 46, "dark blue");
                 },  
                  
                 draw: function(renderer){
                     this.font.draw(renderer.getContext(), "Once Upon an Adventure...", 450, 130); 
                     this.font.draw(renderer.getContext(), "Press ENTER to begin", 250, 530);
                 }
                  
            })));
               
               
             
                this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge){
                    if(action === "start"){
                         me.state.change(me.state.PLAY);    
                    }
                });
                
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ENTER);  
                me.event.unsubscribe(this.handler);
	}
         
     
 
 
 
 
 
 
 
 
 });