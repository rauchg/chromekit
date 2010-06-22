Demo = {
	
	initialize: function(){
		this.manager = new CK.Manager()
			.add(new CK.Window('window-1'))
			.add(new CK.Window('window-2', {components: {tabs: {}}}))
			.add(new CK.Window('window-3'));
		
		$('window-3').getElement('.titlebar .toolbar').addEvent('mousedown', function(ev){
			ev.stopPropagation();
		});
		
		$('add-20-windows').addEvent('click', function(){
			for (var i = 0; i < 20; i++) this.addRandomWindow()
		}.bind(this));
		
		$('toggle-chrome').addEvent('click', function(){
			$(document.body).toggleClass('chrome');
		});
		
		$('do-expose').addEvent('click', function(){
			this.manager.expose();
		}.bind(this));
		
		$('do-3dflip').addEvent('click', function(){
			this.manager.flip3d();
		}.bind(this));
	},
	
	addRandomWindow: function(){
		this.manager.add(new CK.Window($('window-' + $random(1, 2)).clone(true).inject(document.body).setStyles({
			top: $random(0, window.getHeight() - 100),
			left: $random(0, window.getWidth() - 500)
		})));
	}
	
};

window.addEvent('domready', function(){
	Demo.initialize();
});