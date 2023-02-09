import {gl} from "./context";
import {IndexArray} from "./index-array";
import {VertexArray} from "./vertex-array";
import {Vertex} from "./types";
import {defaultShader} from "../example/default-shader";

export class VertexArrayObject {
  private vbo: VertexArray | null = null;
  private ibo: IndexArray | null = null;
  private readonly vao: WebGLVertexArrayObject;
  constructor() {
    this.vao = gl.createVertexArray() as WebGLVertexArrayObject;
    if (this.vao == null) {
      throw new Error(`Failed to create VAO`);
    }
  }
  addVertices(vertices: Vertex[]) {
    this.bind();
    if (this.vbo !== null) {
      throw new Error(`Error when adding VBO to VAO - Cannot redefine existing VertexArray`);
    }
    this.vbo = new VertexArray(vertices);
    this.unbind();
  }
  addIndices(indices: number[]) {
    this.bind();
    if (this.ibo !== null) {
      throw new Error(`Error when adding VBO to VAO - Cannot redefine existing VertexArray`);
    }
    this.ibo = new IndexArray(indices);
    this.unbind();
  }
  bind() {
    gl.bindVertexArray(this.vao);
  }
  unbind() {
    gl.bindVertexArray(null);
  }
  draw() {
    if (this.vbo === null || this.ibo === null) {
      throw new Error(`Failed to draw - IBO or VBO missing`);
    }
    gl.bindVertexArray(this.vao);

    gl.uniform3fv(defaultShader.getUniformLocation("u_color"), new Float32Array([ 1.0, 0.5, 0.5 ]));

    gl.drawElements(gl.TRIANGLES, this.ibo.elements, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}
