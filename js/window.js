/*
---
description: Window with behaviors and components.
authors: 
	-	Guillermo Rauch
requires: 
	-	core/1.2.1: *
provides:
	- window
...
*/

CK.Window = new Class({
	
	Extends: CK.Gadget,
	
	options: {
		behaviors: {
			draggable: {},
			resizable: {}
		},
		components: {},
		zIndex: 500
	},
	
	initialize: function(element, options){
		this.parent(element, options);
		this.element.setStyle('z-index', this.options.zIndex);
		this.components = this.behaviors = {};
		for (var a in this.options.behaviors){
			if (this.options.behaviors[a] !== false) this.behaviors[a] = new CK.Window.Behavior[a](this, this.options.behaviors[a]);
		} 
		for (var b in this.options.components){
			if (this.options.components[b] !== false) this.components[b] = new CK.Window.Component[b](this, this.options.components[b]);
		}
	},
	
	show: function(){
		this.element.setStyle('display', 'block');
		this.hidden = false;
	},
	
	hide: function(){
		this.element.setStyle('display', 'none');
		this.hidden = true;
	}
	
});

CK.Window.Behavior = new Class({
	
	Implements: [Options, Events],
	
	initialize: function(base, options){
		this.base = base;
		this.element = base.element;
		this.setOptions(options);
	}
	
});

CK.Window.Behavior.resizable = new Class({
	
	Extends: CK.Window.Behavior,
	
	initialize: function(base, options){
		this.parent(base, options);
		var body = this.element.getElement('.body'),
				grip = new Element('span', {'class': 'gripper-resize'}).inject(this.element);
		body.makeResizable({handle: grip, modifiers: {y: 'height', x: ''}});
		this.element.makeResizable({handle: grip, modifiers: {y: '', x: 'width'}});
	}
	
});

CK.Window.Behavior.draggable = new Class({
	
	Extends: CK.Window.Behavior,
	
	initialize: function(base, options){
		this.parent(base, options);
		this.drag = new Drag(this.element, {
			handle: this.element.getChildren().filter(function(el){ return !el.hasClass('body'); })
		});		
	}
	
});

CK.Window.Component = new Class({
	
	Implements: [Options, Events],
	
	initialize: function(base, options){
		this.base = base;
		this.element = base.element;
		this.setOptions(options);
	}
	
});

CK.Window.Component.tabs = new Class({
	
	Extends: CK.Window.Component,
	
	options: {
		defaultIndex: 0
	},
	
	initialize: function(base, options){
		this.parent(base, options);
		this.items = this.element.getElements('.tabs li');
		this.pages = this.element.getElements('.body .tab-container');
		var self = this;
		this.element.getElement('.tabs ul').addEvent('click:relay(a)', function(ev){
			ev.preventDefault();
			self.show(self.items.indexOf(this.getParent()));
		});
		if (this.base.behaviors.draggable) this.element.getElement('.tabs ul').addEvent('mousedown:relay(a)', function(ev){
			ev.stopPropagation();
		});
		if ($chk(this.options.defaultIndex)) this.show(this.options.defaultIndex);
	},
	
	show: function(index){
		if (index !== this.current){
			this.pages.setStyle('display', 'none');
			if (this.element.getElement('.tabs li.active')) this.element.getElement('.tabs li.active').removeClass('active');
			this.items[index].addClass('active');
			this.pages[index].setStyle('display', '');
		}
		return this;
	}
	
});