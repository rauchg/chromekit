/*
---
description: 3D Flip ala Windows Vista for the Window Manager
authors: 
	-	Guillermo Rauch
requires: 
	-	core/1.2.1: *
	- manager
	- overlay
	- window
provides:
	- manager.flip.3d
...
*/

(function(){

var WindowsFlip = new Class({
	
	initialize: function(base){
		this.base = base;
		this.element = base.element;
		this.positions_cache = {};
		this.base.addEvent('focus', function(win){
			if (this.element.getElement('.window_flip-focus')) 	
				this.element.getElement('.window_flip-focus').removeClass('window_flip-focus');
			win.element.addClass('window_flip-focus');
		}.bind(this));
		
		document.addEvent('keypress', function(ev){
			if (ev.key == 'n') this.next();
		}.bind(this));
	},
	
	toggle: function(){
		this[this.shown ? 'hide' : 'show']();
	},
	
	show: function(){
		if (this.shown) return this;
		this.element.addClass('window-manager_3dflip');
		$(document.body).overlay();
		this.doShow();
		this.shown = true;
		return this;
	},
	
	doShow: function(){
		this.windows = this.element.getElements('.window');
		if (!this.shown) this.cacheProperties();

		var windows = this.windows.slice(0,6);		
		var flipHeight = 250;		
		var maxWidth = 0, maxHeight = 0;
		
		this.windows.each(function(win){
			maxWidth = Math.max(maxWidth, win.getWidth());
			maxHeight = Math.max(maxHeight, win.getHeight());
		});
		
		this.windows.setStyle('display', 'none');		

		this.scaleFactor = 1;
		if (maxHeight > flipHeight){
			this.scaleFactor = flipHeight / maxHeight;
		}
		
		var x = Math.round((window.getWidth() - (maxWidth + windows.length * 50)) / 2), y = Math.round((window.getHeight() - (maxWidth + windows.length * 50)) / 2);
		windows.each(function(win, i){
			win.setStyle('display', 'block');
					
			var matrix = win.retrieve('flip:matrix');
			if (!matrix){
				matrix = new Fx.Matrix(win, {duration: 300});					
				win.store('flip:matrix', matrix);
			}
		
			matrix.set(Fx.Matrix.prepare({scale: [ this.scaleFactor ]}).to, 'rotateY(5deg) translateZ('+ i * (windows.length > 3 ? 70 : 100)  +'px)');
					
			win.setStyle('left', Math.round((window.getWidth() - ((windows.length + 4) * 100)) / 2) );
			
			win.setStyle('top', this.shown ? 215 : 200).setStyle('opacity', this.shown ? 1 : 0);
			
			win.addEvent('mousedown', this.hide.bind(this));
			
			if (!this.shown){
				win.morph({
					top: 215,
					opacity: 1
				});
			}
			x += 50; y += 50;
			
			if (i + 1 == windows.length) this.base.focus(win.retrieve('gadget'));
		}.bind(this));
		
		this.shownWindows = windows;
	},
	
	cacheProperties: function(){
		this.windows.each(function(win){
			this.positions_cache[$uid(win)] = {left: win.getStyle('left'), top: win.getStyle('top'), 'z-index': win.getStyle('z-index'), display: win.getStyle('display')};
		}, this);
	},
	
	restoreProperties: function(){
		this.windows.each(function(win){
			if (this.positions_cache[$uid(win)]){
				if (this.positions_cache[$uid(win)]){
					win.setStyles(this.positions_cache[$uid(win)]);
					win.retrieve('flip:matrix').set(Fx.Matrix.prepare({scale: [ 1 ]}).to, 'rotateY(0) translateZ(0)');
					win.removeClass('window_flip-focus');
				}
			}
		}, this);
		this.positions_cache = {};
	},
	
	next: function(){
		if (!this.shown || this.windows.length == 1) return this;
		var current = this.windows.getLast();
		current.inject(this.element, 'top');
		
		this.base.focus(this.windows[this.windows.length - 2].retrieve('gadget'));		
		this.doShow();
	},
	
	hide: function(){
		if (!this.shown) return this;
		this.restoreProperties();
		this.element.removeClass('window-manager_3dflip');
		$(document.body).get('overlay').hide();
	}
	
})

CK.Manager.implement({
	
	flip3d: function(){
		if (!this.flip) this.flip = new WindowsFlip(this);
		this.flip.toggle();
	},
	
	flip3dNext: function(){
		this.flip.next();
	}
	
	// flip3d: function(){
	// 	var windows = this.element.getElements('.window');
	// 
	// 	if (this.element.hasClass('window-manager_3dflip')){
	// 		this.element.removeClass('window-manager_3dflip');
	// 		restore_positions(windows);
	// 		this.flip3dshown = false;
	// 	} else {
	// 		this.flip3dshown = true;
	// 		this.element.addClass('window-manager_3dflip');			
	// 		var windows = this.element.getElements('.window');
	// 		cache_positions(windows);
	// 		
	// 		windows.setStyle('display', 'none');
	// 		
	// 		windows = windows.slice(0,6);
	// 		
	// 		var flipHeight = 200;
	// 		
	// 		var maxWidth = 0, maxHeight = 0;
	// 		
	// 		windows.each(function(win){
	// 			maxWidth = Math.max(maxWidth, win.getWidth());
	// 			maxHeight = Math.max(maxHeight, win.getHeight());
	// 		});
	// 		
	// 		var scaleFactor = 1;
	// 		if (maxHeight > flipHeight){
	// 			scaleFactor = flipHeight / maxHeight;
	// 		}
	// 		
	// 		var x = Math.round((window.getWidth() - (maxWidth + windows.length * 50)) / 2), y = Math.round((window.getHeight() - (maxWidth + windows.length * 50)) / 2);
	// 		windows.each(function(win, i){
	// 			win.setStyle('display', 'block');
	// 					
	// 			var matrix = win.retrieve('flip:matrix');
	// 			if (!matrix){
	// 				matrix = new Fx.Matrix(win, {duration: 300});					
	// 				win.store('flip:matrix', matrix);
	// 			}
	// 			
	// 			matrix.set(Fx.Matrix.prepare({scale: [ scaleFactor ]}).to, 'rotateY(5deg) translateZ('+i * (windows.length > 3 ? 70 : 100) +'px)');
	// 					
	// 			win.setStyle('left', Math.round((window.getWidth() - ((windows.length + 4) * 100)) / 2) ).setStyle('top', 200).setStyle('opacity', 0);
	// 			
	// 			win.addEvent('mouseenter', function(){
	// 				
	// 			});
	// 			
	// 			this.addEvent('focus', onFocus);
	// 			
	// 			win.morph({
	// 				top: 215,
	// 				opacity: 1
	// 			});
	// 			x += 50; y += 50;
	// 			
	// 			this.focus(win.retrieve('gadget'));
	// 		}.bind(this));
	// 	}
	// }
	
});

})();