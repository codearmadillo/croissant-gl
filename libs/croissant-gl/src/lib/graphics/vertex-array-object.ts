import {IndexArray} from "./index-array";
import {VertexArray} from "./vertex-array";
import {Vertex} from "../types/graphics";

export class VertexArrayObject {
  private vbo: VertexArray | null = null;
  private ibo: IndexArray | null = null;
  private readonly vao: WebGLVertexArrayObject;
  private readonly webGl2RenderingContext: WebGL2RenderingContext;
  constructor(webGl2RenderingContext: WebGL2RenderingContext) {
    this.webGl2RenderingContext = webGl2RenderingContext;
    this.vao = this.webGl2RenderingContext.createVertexArray() as WebGLVertexArrayObject;
    if (this.vao == null) {
      throw new Error(`Failed to create VAO`);
    }
  }
  addVertices(vertices: Vertex[]) {
    this.bind();
    if (this.vbo !== null) {
      throw new Error(`Error when adding VBO to VAO - Cannot redefine existing VertexArray`);
    }
    this.vbo = new VertexArray(vertices, this.webGl2RenderingContext);
    this.unbind();
  }
  addIndices(indices: number[]) {
    this.bind();
    if (this.ibo !== null) {
      throw new Error(`Error when adding VBO to VAO - Cannot redefine existing VertexArray`);
    }
    this.ibo = new IndexArray(indices, this.webGl2RenderingContext);
    this.unbind();
  }
  bind() {
    this.webGl2RenderingContext.bindVertexArray(this.vao);
  }
  unbind() {
    this.webGl2RenderingContext.bindVertexArray(null);
  }
  drawElements() {
    if (this.vbo === null || this.ibo === null) {
      throw new Error(`Failed to draw - IBO or VBO missing`);
    }
    this.webGl2RenderingContext.bindVertexArray(this.vao);
    this.webGl2RenderingContext.drawElements(this.webGl2RenderingContext.TRIANGLES, this.ibo.elements, this.webGl2RenderingContext.UNSIGNED_SHORT, 0);
    this.webGl2RenderingContext.bindVertexArray(null);
  }
  drawLines() {
    if (this.vbo === null || this.ibo === null) {
      throw new Error(`Failed to draw - IBO or VBO missing`);
    }
    this.webGl2RenderingContext.bindVertexArray(this.vao);
    this.webGl2RenderingContext.drawElements(this.webGl2RenderingContext.LINES, this.ibo.elements, this.webGl2RenderingContext.UNSIGNED_SHORT, 0);
    // this.webGl2RenderingContext.drawElements(this.webGl2RenderingContext.TRIANGLES, this.ibo.elements, this.webGl2RenderingContext.UNSIGNED_SHORT, 0);
    this.webGl2RenderingContext.bindVertexArray(null);
  }
  destroy() {
    this.ibo?.destroy();
    this.vbo?.destroy();
    this.webGl2RenderingContext.deleteVertexArray(this.vao);
  }
}
