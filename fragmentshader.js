var fragmentShader = `

precision mediump float;

uniform sampler2D u_image;

varying vec2 texCoord;

uniform vec2 onePixel;

uniform bool doStep;

vec2 getCoords(vec2 coord, vec2 offset){
	//return vec2(mod(coord.x + onePixel.x * offset.x, 1.0), mod(coord.y + onePixel.y * offset.y, 1.0));
	return mod(coord + onePixel * offset, 1.0);
}

float r = 0.0;
float sum = 0.0;

void main(void){

	if(doStep){

		float r = texture2D(u_image, texCoord).r;

		float sum = 0.0;

		sum += texture2D(u_image, getCoords(texCoord, vec2(-1.0, -1.0))).r;
		sum += texture2D(u_image, getCoords(texCoord, vec2(0.0, -1.0))).r;
		sum += texture2D(u_image, getCoords(texCoord, vec2(1.0, -1.0))).r;
		sum += texture2D(u_image, getCoords(texCoord, vec2(-1.0, 1.0))).r;
		sum += texture2D(u_image, getCoords(texCoord, vec2(0.0, 1.0))).r;
		sum += texture2D(u_image, getCoords(texCoord, vec2(1.0, 1.0))).r;
		sum += texture2D(u_image, getCoords(texCoord, vec2(-1.0, 0.0))).r;
		sum += texture2D(u_image, getCoords(texCoord, vec2(1.0, 0.0))).r;

		//sum = sum / 255.0;

		/*float g = 0.0;
		float b = texture2D(u_image, texCoord).b * 0.95;
		
		if(b > 0.2){
			g = texture2D(u_image, texCoord).g * 1.06;
		} else {
			g = texture2D(u_image, texCoord).g * 0.98;
		}

		if(r != 0.0 && (sum < 2 || sum > 3)){
			r = 0.0;
			g = 0.1;
			b = 1.0;
		} else if(r == 0.0 && sum == 3){
			r = 1.0;
			g = 1.0;
			b = 1.0;
		} else {
			
		}
		gl_FragColor = vec4(r, g, b, 1.0);*/
		

		if(r != 0.0 && (sum < 2.0 || sum > 3.0)){
			r = 0.0;
		} else if(r == 0.0 && sum == 3.0){
			r = 1.0;
		}
		
		gl_FragColor = vec4(r, r, r, 1.0);

	} else {

		gl_FragColor = texture2D(u_image, texCoord).rgba;
		
	}
}

`;








































