import {gl} from "./context";
import {IndexArray} from "./index-array";
import {VertexArray} from "./vertex-array";
import {Vertex} from "../types/graphics";

export class VertexArrayObject {
  private vbo: VertexArray | null = null;
  private ibo: IndexArray | null = null;
  private readonly vao: WebGLVertexArrayObject;
  constructor() {
    this.vao = gl().createVertexArray() as WebGLVertexArrayObject;
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
    gl().bindVertexArray(this.vao);
  }
  unbind() {
    gl().bindVertexArray(null);
  }
  drawElements() {
    if (this.vbo === null || this.ibo === null) {
      throw new Error(`Failed to draw - IBO or VBO missing`);
    }
    gl().bindVertexArray(this.vao);
    gl().drawElements(gl().TRIANGLES, this.ibo.elements, gl().UNSIGNED_SHORT, 0);
    gl().bindVertexArray(null);
  }
  drawLines() {
    if (this.vbo === null || this.ibo === null) {
      throw new Error(`Failed to draw - IBO or VBO missing`);
    }
    gl().bindVertexArray(this.vao);
    gl().drawElements(gl().LINES, this.ibo.elements, gl().UNSIGNED_SHORT, 0);
    // gl().drawElements(gl().TRIANGLES, this.ibo.elements, gl().UNSIGNED_SHORT, 0);
    gl().bindVertexArray(null);
  }
}
