/*
---
description: Base gadget class
authors: 
	-	Guillermo Rauch
requires: 
	-	core/1.2.1: *
provides:
	- gadget
...
*/

CK.Gadget = new Class({
	
	Implements: [Events, Options],
	
	initialize: function(element, options){
		if ($(element).retrieve('gadget')) return $(element).retrieve('gadget');
		this.element = $(element).store('gadget', this);
		this.setOptions(options);
	}
	
});