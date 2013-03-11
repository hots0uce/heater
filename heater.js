
var heater;
(function(win,doc,undefined) {
	var coords = {},min=0,max=0,time=300,
		block_size = {
			x: 10,
			y: 10
		},
		blocks = {
			x: 0,
			y: 0
		},
		max = 1,
		canvas,ctx;

	heater = {};

	function monitorMouse(e) {
		var x=e.clientX,y=e.clientY,
			block = {
				x: Math.ceil(x/block_size.x),
				y: Math.ceil(y/block_size.y)
			};
		
		coords[block.x] = coords[block.x] || {};

		if(!coords[block.x][block.y]) {
			coords[block.x][block.y] = 0;
		}

		coords[block.x][block.y]++;

		max = Math.max(max,coords[block.x][block.y]);
	}


	document.addEventListener('mousemove',monitorMouse,false);

	function init() {
		canvas = doc.createElement('canvas');
		ctx = canvas.getContext('2d');
		var sizeCanvas = function() {
				var x = canvas.width/block_size.x,
					y = canvas.height/block_size.y;
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
				blocks.x = Math.ceil(x);
				blocks.y = Math.ceil(y);
			};

		canvas.id = 'heater_canvas';
		canvas.style.position = 'absolute';
		canvas.style.zIndex = '9999';
		canvas.style.top = 0;
		canvas.style.left = 0;

		sizeCanvas();
		
		doc.body.appendChild(canvas);

		window.addEventListener('resize',sizeCanvas,false);

		setTimeout(function() {
			drawCanvas(canvas,ctx);
		},time)

	}

	function getRGBA(x,y) {
		var block = {
				x: Math.ceil(x/block_size.x),
				y: Math.ceil(y/block_size.y)
			},
			val = (coords[block.x] && coords[block.x][block.y]) ? coords[block.x][block.y] : 0,
			value = val/max;




	
		return {
			a: 0.5,
			r: parseInt(255*value,10),
			g: parseInt(255 * (1-value),10),
			b: 0
		};
	}

	function each(x,fun) {
		var key;
		for(key in x) {
			fun(x[key],x,key);
		}
	}

	function drawCanvas(can,ctx) {
		var x=0,y=0,pos=0,
			rgba;

		ctx.clearRect(0,0,can.width,can.height);

		for(x;x<can.width;x=x+block_size.x) {
			for(y;y<can.height;y=y+block_size.y) {
				rgba = getRGBA(x,y);
				ctx.fillStyle = "rgba("+rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+")";
				ctx.fillRect(x,y,block_size.x,block_size.y);
			}
			y=0;
		}


		

		setTimeout(function() {
			drawCanvas(can,ctx);
		},time);
	}


	heater.getRGBA = getRGBA;
	heater.init = init;
	heater.coords = coords;
	heater.drawCanvas = function() {
		drawCanvas(canvas,ctx);
	};

	return heater;
})(window,window.document);
