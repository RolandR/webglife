
function Renderer(canvasId, world){

	var canvas = document.getElementById(canvasId);
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

	var shaderProgram;
	var size;

	var onePixelAttr;
	var doStepAttr;

	var fba;
	var fbb;
	var txa;
	var txb;

	var worldTexture;

	var lastHeight = canvas.height;
	var lastWidth = canvas.width;

	var superfast = window.location.search == "?superfast=true";

	init();

	function init(){

		/*=========================Shaders========================*/


		// Create a vertex shader object
		var vertShader = gl.createShader(gl.VERTEX_SHADER);

		// Attach vertex shader source code
		gl.shaderSource(vertShader, vertexShader);

		// Compile the vertex shader
		gl.compileShader(vertShader);

		// Create fragment shader object
		var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

		// Attach fragment shader source code
		gl.shaderSource(fragShader, fragmentShader);

		// Compile the fragmentt shader
		gl.compileShader(fragShader);

		// Create a shader program object to store
		// the combined shader program
		shaderProgram = gl.createProgram();

		// Attach a vertex shader
		gl.attachShader(shaderProgram, vertShader); 

		// Attach a fragment shader
		gl.attachShader(shaderProgram, fragShader);

		// Link both programs
		gl.linkProgram(shaderProgram);

		// Use the combined shader program object
		gl.useProgram(shaderProgram);

		if(gl.getShaderInfoLog(vertShader)){
			console.warn(gl.getShaderInfoLog(vertShader));
		}
		if(gl.getShaderInfoLog(fragShader)){
			console.warn(gl.getShaderInfoLog(fragShader));
		}
		if(gl.getProgramInfoLog(shaderProgram)){
			console.warn(gl.getProgramInfoLog(shaderProgram));
		}


		vertexBuffer = gl.createBuffer();

		/*==========Defining and storing the geometry=======*/

		var vertices = [
			-1.0, -1.0,
			 1.0, -1.0,
			-1.0,  1.0,
			-1.0,  1.0,
			 1.0, -1.0,
			 1.0,  1.0
		];

		size = ~~(vertices.length/2);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

		// Get the attribute location
		var coord = gl.getAttribLocation(shaderProgram, "coordinates");

		// Point an attribute to the currently bound VBO
		gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

		// Enable the attribute
		gl.enableVertexAttribArray(coord);
		
		onePixelAttr = gl.getUniformLocation(shaderProgram, "onePixel");
		doStepAttr = gl.getUniformLocation(shaderProgram, "doStep");

		worldTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, worldTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lastWidth, lastHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, world);

		// texture and framebuffer

		txa = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, txa);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lastWidth, lastHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		
		fba = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, fba);
		
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, txa, 0);

		// texture and framebuffer

		txb = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, txb);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lastWidth, lastHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		
		fbb = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbb);
		
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, txb, 0);

	}

	function render(){
		
		gl.uniform2f(onePixelAttr, 1/lastWidth, 1/lastHeight);
		gl.uniform1f(doStepAttr, true);

		gl.bindTexture(gl.TEXTURE_2D, worldTexture);

		renderInternally(false);
		
	}

	function renderInternally(mode){

		gl.uniform1f(doStepAttr, true);

		if(mode){

			gl.bindFramebuffer(gl.FRAMEBUFFER, fbb);

			gl.drawArrays(gl.TRIANGLES, 0, size);

			gl.bindTexture(gl.TEXTURE_2D, txb);

		} else {
			
			gl.bindFramebuffer(gl.FRAMEBUFFER, fba);

			gl.drawArrays(gl.TRIANGLES, 0, size);

			gl.bindTexture(gl.TEXTURE_2D, txa);
			
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.uniform1f(doStepAttr, false);

		gl.drawArrays(gl.TRIANGLES, 0, size);

		if(superfast){
			setTimeout(function(){renderInternally(!mode);}, 0);
		} else {
			window.requestAnimationFrame(function(){renderInternally(!mode);});
		}
		
	}

	return{
		 render: render
	};

}



















