// Copyright Nir Tayeb - Released under the MIT license <http://code.google.com/p/mootools-ui/>

Math.toRadians = function(angel){
    return angel*Math.PI/180;
}

Math.toAngle = function(radian){
    return radian*180/Math.PI;
}

Fx.Matrix = new Class({
	
	Extends: Fx,

	initialize: function (element, options) {
	    this.parent(options);
	    this.element = element;
	},

	set: function (matrix, extraProps) {
	    if (Browser.Engine.trident) {
	           if(!this.element.filters["DXImageTransform.Microsoft.Matrix"]) {
	                this.element.style.filter = (this.element.style.filter?'':' ') + "progid:DXImageTransform.Microsoft.Matrix(M11='1.0', sizingMethod='auto expand')";
	            }
	            $extend(this.element.filters["DXImageTransform.Microsoft.Matrix"], {
	                M11: matrix[0][0],
	                M12: matrix[0][1],
	                M21: matrix[1][0],
	                M22: matrix[1][1]
	            }); 
	    } else {
	        var propName = Browser.Engine.gecko?"-moz-transform":"webkitTransform";
	        this.element.setStyle(propName, "matrix("+matrix.flatten().join(",")+",0,0) " + extraProps);
	    }
    
	    this.element.store('matrix', matrix);
	},

	compute: function (from, to, delta) {
	    var a = [[],[]];
	    for(var i=0;i<2;i++){
	        for(var j=0;j<2;j++){
	            a[i][j] = Fx.compute(from[i][j], to[i][j], delta);
	        }
	    }
	    return a;
	},

	start: function (props) {
		// Patched by Guillermo Rauch not to ignore the Fx `link` engine
		if (!this.check(props)) return this;

	    var from = this.element.retrieve('matrix', 0),
	        to = 0;
	    /*for (var p in props) {
	        if(props[p].length==1){
	            if(from==0){ from=[[1,0],[0,1]]; }
	            var m = Fx.Matrix.Functions[p](props[p][0]);
	            to = to===0?m:Fx.Matrix.multiply(to, m);
	        }else{
	            var m1 = Fx.Matrix.Functions[p](props[p][0]),
	             m2 = Fx.Matrix.Functions[p](props[p][1]);
	            if(from===0) from = m1;
	            else from = Fx.Matrix.multiply(from , m1);
            
	            if(to===0) to = m2;
	            else to = Fx.Matrix.multiply(to , m2);
	        }
	    }*/
	    var prep = Fx.Matrix.prepare(from, to, props);
	    return this.parent(prep.from, prep.to);
	}
    
});

Fx.Matrix.prepare = function (from, to, props) {
    if(!to && !props){
        props = from;
        from = to = 0;
    }
    for (var p in props) {
        if(props[p].length==1){
            if(from==0){ from=[[1,0],[0,1]]; }
            var m = Fx.Matrix.Functions[p](props[p][0]);
            to = to===0?m:Fx.Matrix.multiply(to, m);
        }else{
            var m1 = Fx.Matrix.Functions[p](props[p][0]),
             m2 = Fx.Matrix.Functions[p](props[p][1]);
            if(from===0) from = m1;
            else from = Fx.Matrix.multiply(from , m1);
            
            if(to===0) to = m2;
            else to = Fx.Matrix.multiply(to , m2);
        }
    }

    return {from: from, to: to};
};

(function(){

function multiply (matrix1, matrix2) {
    return [
        [
            matrix1[0][0]*matrix2[0][0]
                + matrix1[0][1] * matrix2[1][0],
            matrix1[0][0]*matrix2[0][1]
                + matrix1[0][1] * matrix2[1][1]
        ],
        [
            matrix1[1][0]*matrix2[0][0]
                + matrix1[1][1] * matrix2[1][0],
            matrix1[1][0]*matrix2[0][1]
                + matrix1[1][1] * matrix2[1][1]
        ]
    ];
}

Fx.Matrix.multiply = function () {
    var args = $A(arguments);
    var fm = args[0];
    for(var i=1;i<args.length;i++){
        fm = multiply(fm, args[i]);
    }
    return fm;
}
})();



Fx.Matrix.Functions = {};

Fx.Matrix.Functions.skewY = function (angle) {
    return [[1,	0], [Math.tan(Math.toRadians(angle)), 1]];
}


Fx.Matrix.Functions.skewX = function (angle) {
    return [[1,	Math.tan(Math.toRadians(angle))], [0, 1]];
}

Fx.Matrix.Functions.rotate = function (angle) {
    var a = Math.toRadians(angle);
    return [[Math.cos(a),-Math.sin(a)],[Math.sin(a),Math.cos(a)]];
}

Fx.Matrix.Functions.scale = function(val) {
    return [[val, 0], [0, val]];
}

Fx.Matrix.Functions.scaleNonUniform = function (xFactor, yFactor) {
    return [[xFactor, 0], [0, yFactor]];
}

Fx.Matrix.Functions.rotateFromVector = function (x, y) {
    return Fx.Matrix.Functions.rotate(Math.toAngle(Math.atan2(y, x)));
}