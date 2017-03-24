


var webglife = new Webglife();

function Webglife(){

	var canvasContainer = document.getElementById("canvasContainer");
	var canvas = document.getElementById("renderCanvas");

	function scale(){

		canvas.width = ~~(canvasContainer.clientWidth);
		canvas.height = ~~(canvasContainer.clientHeight);
		
	}

	window.onresize = scale;

	scale();

	var width = canvas.width;
	var height = canvas.height;

	var cells = new Uint8Array(height * width * 4);

	for(var i = 0; i < cells.length; i+=4){
		cells[i] = Math.round(Math.random())*255;
	}

	/*var middle = ~~(~~(height/2) * width + width/2);

	for(var i = 0; i < 30; i++){
		cells[middle+i] = 255;
	}

	cells[middle+width] = 255;*/

	var renderer = new Renderer('renderCanvas', cells);
	renderer.render();
	
}












