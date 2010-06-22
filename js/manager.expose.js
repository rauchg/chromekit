/*
---
name: OSX Expose effect for the Window Manager
authors: 
	-	Guillermo Rauch
requires: 
	- core/1.2.1: *
provides:
	- manager.expose
...
*/

(function(){

// Expose placement calculations by Jens Egeblad <http://smallwindows.sourceforge.net/>

var Expose = new Class({
	
	Implements: [Options],
	
	options: {
		relativeTo: null
	},
	
	initialize: function(windows, options){
		this.setOptions(options);
		this.relativeTo = this.options.relativeTo || document.body;
		this.windows = [];
		windows.each(function(win, i){
			this.windows[i] = new Expose.Window(win, this);
		}, this);
		this.screen = {w: window.getWidth(), h: window.getHeight()};
	},
	
	show: function(){
		this.removeOverlap();
		this.place();
	},
	
	removeOverlap: function(){
		while (this.localSearch()){
			for (var k = 0; k < this.windows.length; ++k){
				this.windows[k].scaleAroundCenter(0.98);
			}
		}
	},
	
	calculateOverlap: function(index, x, y){
		var x2 = x + this.windows[index].w;
		var y2 = y + this.windows[index].h;

		var result = -0.01;

		for (var i = 0; i < this.windows.length; ++i) {
			if (i == index) continue;

			var xOverlap = 0, yOverlap = 0, x1O, x2O, y1O, y2O;
			
			x1O = Math.max(this.windows[i].x, x);
			x2O = Math.min(this.windows[i].x + this.windows[i].w, x2);
			if (x1O <= x2O) {
				xOverlap = x2O - x1O;
			}

			y1O = Math.max(this.windows[i].y, y);
			y2O = Math.min(this.windows[i].y + this.windows[i].h, y2);

			if (y1O <= y2O) {
				yOverlap = y2O - y1O;
			}
			
			result += xOverlap * yOverlap;
		}
		
		return result;
	},
	
	findBestHorizontalPosition: function(index){
		var y1 = this.windows[index].y, 
				y2 = this.windows[index].y + this.windows[index].h, 
				bestOverlap = 1e34, 
				bestX = this.windows[index].x,
				w = this.windows[index].w,
				overlap;
		
		for (var i = 0; i < this.windows.length; ++i){
			if (i == index) continue;
			
			if (this.windows[i].y < y2 && this.windows[i].y + this.windows[i].h > y1) {
				if (this.windows[i].x - w >= 0) {
					overlap = this.calculateOverlap(index, this.windows[i].x - w, y1);
					if (overlap < bestOverlap) {
						bestX = this.windows[i].x - w;
						bestOverlap = overlap;
					}
				}
				if (this.windows[i].x + this.windows[i].w + w < this.screen.w) {
					overlap = this.calculateOverlap(index, this.windows[i].x + this.windows[i].w, y1);
					if (overlap < bestOverlap) {
						bestX = this.windows[i].x + this.windows[i].w;
						bestOverlap = overlap;
					}
				}
			}
		}
		
		// Test left and right side of screen
		overlap = this.calculateOverlap(index, 0, y1);
		if (overlap < bestOverlap){
			bestX = 0;
			bestOverlap = overlap;
		}

		overlap = this.calculateOverlap(index, this.screen.w - w, y1);
		if (overlap < bestOverlap){
			bestX = this.screen.w - w;
			bestOverlap = overlap;
		}		
		
		return {bestX: bestX, bestOverlap: bestOverlap};
	},
	
	findBestVerticalPosition: function(index){
		var x1 = this.windows[index].x,
				x2 = this.windows[index].x + this.windows[index].w,
				bestOverlap = 1e34,
				bestY = this.windows[index].y,
				h = this.windows[index].h,
				overlap;

		for (var i = 0; i < this.windows.length; ++i) {
			if (i == index) continue;

			if (this.windows[i].x < x2 && this.windows[i].x + this.windows[i].w > x1) {
				if (this.windows[i].y - h >= 0 && this.windows[i].y < this.screen.h) {
					overlap = this.calculateOverlap(index, x1, this.windows[i].y - h);
					if (overlap < bestOverlap) {
						bestY = this.windows[i].y - h;
						bestOverlap = overlap;
					}
				}
				if (this.windows[i].y + this.windows[i].h > 0 && this.windows[i].y + this.windows[i].h + h < this.screen.h) {
					overlap = this.calculateOverlap(index, x1, this.windows[i].y + this.windows[i].h);
					if (overlap < bestOverlap) {
						bestY = this.windows[i].y + this.windows[i].h;
						bestOverlap = overlap;
					}
				}
			}
		}

		// Test top and bottom of screen
		overlap = this.calculateOverlap(index, x1, 0);
		if (overlap < bestOverlap) {
			bestY = 0;
			bestOverlap = overlap;
		}

		overlap = this.calculateOverlap(index, x1, this.screen.h - h);
		if (overlap < bestOverlap) {
			bestY = this.screen.h - h;
			bestOverlap = overlap;
		}
		
		return {bestY: bestY, bestOverlap: bestOverlap};
	},
	
	localSearch: function(){
		var improvement = false, totalOverlap = 0;
		
		do {
			improvement = false;
			for (var i = 0; i < this.windows.length; ++i) {
				var improved = false;
				do {
					improved = false;
					
					var oldOverlap = this.calculateOverlap(i, this.windows[i].x, this.windows[i].y),
							horPos = this.findBestHorizontalPosition(i), 
							verPos = this.findBestVerticalPosition(i), 
							newX = horPos.bestX, 
							newY = verPos.bestY, 
							overlapH = horPos.bestOverlap, 
							overlapV = verPos.bestOverlap;
										
					if (overlapH < oldOverlap - 0.1 || overlapV < oldOverlap - 0.1) {
						improved = true;
						improvement = true;
						if (overlapV > overlapH) this.windows[i].x = newX;
						else this.windows[i].y = newY;
					}
				} while (improved);
			}
		} while(improvement);
		
		for (var k = 0; k < this.windows.length; ++k){
			totalOverlap += this.calculateOverlap(k, this.windows[k].x, this.windows[k].y);
		}
		
		return (totalOverlap > 0.1);
	},
	
	place: function(){
		for (var k = 0; k < this.windows.length; ++k){
			this.windows[k].place();
		}
	}
	
});

Expose.Window = new Class({
	
	initialize: function(element, base){
		this.element = $(element);
		this.base = base;
		
		var pos = this.element.getPosition(this.base.relativeTo);
		this.x = this.oX = pos.x;
		this.y = this.oY = pos.y;
		this.w = this.oW = this.element.getWidth();
		this.h = this.oH = this.element.getHeight();		
		
		this.matrix = new Fx.Matrix(this.element, {duration: 300});
		this.matrix.set(Fx.Matrix.prepare({scale: [1]}).to);
		this.morph = new Fx.Morph(this.element);
	},
	
	scaleAroundCenter: function(value){
		var centerX = this.x + (this.w / 2), centerY = this.y + (this.h / 2);
		this.w = parseInt(value * this.w, 10);
		this.h = parseInt(value * this.h, 10);
		this.x = centerX - (this.w / 2);
		this.y = centerY - (this.h / 2);
	},
	
	place: function(){
		this.matrix.start({ scale: [this.h / this.oH] });
		this.morph.start({
			left: this.x,
			top: this.y
		});
	}
	
});

CK.Manager.implement({
	
	expose: function(){
		new Expose(this.element.getChildren('div.window'), {relativeTo: this.element}).show();
	}
	
});

})();