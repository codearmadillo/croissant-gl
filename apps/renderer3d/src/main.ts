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
gl.clear(gl.COLOR_BUFFER_BIT);

interface Drawable {
  draw(): void;
}

class Square implements Drawable {
  protected readonly vao: WebGLVertexArrayObject;
  constructor() {
    this.vao = gl.createVertexArray() as WebGLVertexArrayObject;
    if (this.vao == null) {
      throw new Error(`Failed to create VAO`);
    }
    this.defineVertices();
    this.defineIndices();
  }
  protected defineVertices() {
    gl.bindVertexArray(this.vao);

    const vertices = new Float32Array([
      0.5, -0.5, 0,
      0.5, 0.5, 0,
      -0.5, 0.5, 0,
      -0.5, -0.5, 0
    ]);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.bindVertexArray(null);
  }
  protected defineIndices() {
    gl.bindVertexArray(this.vao);

    const indices = new Uint16Array([
      0, 1, 2,
      0, 2, 3
    ]);
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
  }
  draw() {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}

const mySquare = new Square();
mySquare.draw();

