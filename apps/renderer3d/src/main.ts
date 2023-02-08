import {gl} from "./renderer/context";
import {defaultShader} from "./example/default-shader";

if (gl === null || gl === undefined) {
  throw new Error(`WebGl2 is not supported`);
}

defaultShader.bind();

/////////////////////
// SCENE
/////////////////////
gl.clearColor(1, 1, 1, 1);

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
