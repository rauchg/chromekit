ChromeKit
=========

ChromeKit is a toolkit engineered to deliver a desktop-like experience in a web browser, with CSS3 and HTML5, and some healthy bits of JavaScript.

Check out the demo [here](http://devthought.com/wp-content/projects/chromekit/).

![Screenshot](http://cl.ly/1Rqs/content)

Project Goals
-------------

* Deliver a rich, desktop-like experience without a performance overhead

* Take advantage of the most modern technologies available today (HTML5, CSS3), specially those seen in the Webkit engine.

* Null (or next to null) image usage

* JavaScript framework agnosticism

* Incorporate behaviors and utilities observed in other desktop environments. 

* Optimize for the most common functions:

	- Dragging 

	- Minimize and maximize

* Deliver additional components that alter the behavior of windows or presentation of the content
  
	- Stylized buttons, inputs.

	- Tabs

	- Status bars

* Flexibility in design

	- Windows support scrolling or can grow to accommodate the content size. The chroming strategy adapts to the content and is selected by the developer, instead of the developer having to work around the chrome limitations by altering the content user experience and interaction.

	- No inherited styling for the content. This allows for fast iteration and the possibility of different people working on different widgets that *then* become windows, but could be available otherwise. For example, it wouldn't make sense to deliver desktop chrome in a mobile device, but the content style can remain consistent.

* Intelligent degradation strategy for cross-browser, cross-platform compatibility:

	- Deliver the _content_ to all browsers and platforms. Out-of-the-box, effortless mobile support.

	- Only replicate visual effects or eye candy when the performance is not compromised. Tradeoffs are evaluated based on the impact on usability.
	
How it's done
-------------

- Graceful degradation / Optimization mode: 

	Standard, solid borders and backgrounds are used in the CSS files, and chrome.css applies advanced CSS techniques.
	
- Window close / minimize / maximize buttons:

  border-radius + background with radial gradient() function + text-shadow (for labels)

- Tabs

	border-radius + background with radial gradient() function
	
- Resize gripper

	delivered through data: uri, or degrades to an image for IE6/7 with CSS that validates
	
- Window shadow

	box-shadow
	
- Expose (experimental)

	Based on the work by Jens England (C++ Windows Expose implementation) and the paper [Guided Local Search for the Three-Dimensional Bin-Packing Problem](http://joc.journal.informs.org/cgi/content/abstract/15/3/267)
	
- Vista-like 3D flip (using CSS3 3d transforms)

	![Screenshot](http://cl.ly/1S68/content)
	
- Toolbar

	border-radius + opacity (hover effect)

Credits
-------

Guillermo Rauch (http://devthought.com <guillermo@learnboost.com>)

Nathan White (http://nwhite.net <nathan@learnboost.com>)