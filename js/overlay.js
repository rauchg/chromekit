/*
---
description: Reusable overlay interface
authors: 
	-	Guillermo Rauch
requires: 
	-	core/1.2.1: *
provides:
	- overlay
...
*/

CK.Overlay = new Class({
	
	Implements: Options,
	
	options: {
		opacity: 0.8
	},
	
	initialize: function(element, options){
		this.element = $(element);
		this.setOptions(options);
		this.overlay = new Element('div', {'class': 'overlay'}).inject(this.element, 'after').fade('hide');
		this.bound = {
			adjustPosition: this.adjustPosition.bind(this),
			adjustSize: this.adjustSize.bind(this)
		};		
		if (this.element.get('tag') == 'body'){
			if (Browser.Engine.trident4){
				window.addEvents({
					resize: this.bound.adjustSize,
					scroll: this.bound.adjustPosition
				});
			} else {
				this.overlay.setStyle('position', 'fixed');
			}
		} else {
			this.adjustSize().adjustPosition();
			this.overlay.style.webkitTransform = this.element.style.webkitTransform;
			this.overlay.setStyle('z-index', this.element.getStyle('z-index') + 1);
		}
	},
	
	adjustSize: function(){
		this.overlay.setStyles({
			width: this.element.get('tag') == 'body' ? window.getWidth() : this.element.getWidth(),
			height: this.element.get('tag') == 'body' ? window.getHeight() : this.element.getHeight()
		});
		return this;
	},
	
	adjustPosition: function(){
		this.overlay.setStyles({
			top: this.element[this.element.get('tag') == 'body' ? 'getScrollTop' : 'getTop'](),
			left: this.element[this.element.get('tag') == 'body' ? 'getScrollLeft' : 'getLeft']()
		});
		return this;
	},
	
	show: function(){
		this.overlay.fade(this.options.opacity);
		return this;
	},
	
	hide: function(){
		this.overlay.fade('hide');
		return this;
	},
	
	destroy: function(){
		this.overlay.destroy();
	}
	
})

Element.Properties.overlay = {

	set: function(options) {
		var overlay = this.retrieve('overlay');
		if (overlay) overlay.destroy();
		return this.eliminate('overlay').store('overlay:options', options);
	},

	get: function(options) {
		if (options || !this.retrieve('overlay')) {
			if (options || !this.retrieve('overlay:options')) this.set('overlay', options);
			this.store('overlay', new CK.Overlay(this, this.retrieve('overlay:options')));
		}
		return this.retrieve('overlay');
	}

};

Element.implement({
	
	overlay: function() {
		this.get('overlay').show();
		return this;
	}
	
});