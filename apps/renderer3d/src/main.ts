import {gl} from "./renderer/context";
import {vertexShaderSource} from "./renderer/shaders/vertex.shader";
import {fragmentShaderSource} from "./renderer/shaders/fragment.shader";

if (gl === null || gl === undefined) {
  throw new Error(`WebGl2 is not supported`);
}

/////////////////////////////////////////
// SHADERS
/////////////////////////////////////////
const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.error(gl.getShaderInfoLog(vertexShader));
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.error(gl.getShaderInfoLog(fragmentShader));
}

const shaderProgram = gl.createProgram() as WebGLProgram;
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(shaderProgram));
}

gl.deleteShader(vertexShader);
gl.deleteShader(fragmentShader);

gl.useProgram(shaderProgram);

/////////////////////
// SCENE
/////////////////////
gl.clearColor(1, 1, 1, 1);
gl.useProgram(shaderProgram);

/////////////////////
// GEOMETRY
/////////////////////
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const vertices = new Float32Array([
  -0.5, -0.5, 0.0,
  0.5, -0.5, 0.0,
  0.0, 0.5, 0.0
]);
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indices = new Uint16Array([
  0, 1, 2
]);
const ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
