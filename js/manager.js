/*
---
description: Window Manager.
authors: 
	-	Guillermo Rauch
requires: 
	-	core/1.2.1: *
provides:
	- manager
...
*/

CK.Manager = new Class({
	
	Implements: [Options, Events],
	
	options: {
		autoInject: true
	},
	
	initialize: function(options){
		this.setOptions(options);
		this.zIndex = 0;
		var self = this;
		this.element = new Element('div', {'class': 'window-manager'}).addEvent('mousedown:relay(div.window)', function(){
			self.focus(this.retrieve('gadget'));
		});
		if (this.options.autoInject) this.inject(document.body, 'top');
	},
	
	inject: function(to, where){
		this.element.inject(to, where);
		return this;
	},
	
	add: function(win, noFocus){
		this.zIndex = Math.max(this.zIndex, win.element.getStyle('z-index'));
		win.element.inject(this.element);
		if (!noFocus) this.focus(win);
		return this;
	},
	
	focus: function(win){
		if (this.current) this.current.element.removeClass('window-focus');	
		this.zIndex += 1;	
		win.element.setStyle('z-index', this.zIndex).addClass('window-focus');
		this.fireEvent('focus', win);		
		this.current = win;
		return this;
	}
	
});