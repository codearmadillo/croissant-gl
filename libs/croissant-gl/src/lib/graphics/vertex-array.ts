import { Vertex } from "../types/graphics";
import {SizeOf} from "../types/sizeof";

export class VertexArray {
  private readonly buffer: WebGLBuffer | null;
  private readonly vertices: Vertex[];
  private readonly webGl2RenderingContext: WebGL2RenderingContext;
  constructor(vertices: Vertex[], webGl2RenderingContext: WebGL2RenderingContext) {
    this.webGl2RenderingContext = webGl2RenderingContext;
    this.vertices = vertices;
    this.buffer = this.webGl2RenderingContext.createBuffer();
    if (this.buffer === null) {
      throw new Error(`Tried creating VBO but createBuffer failed`);
    }
    this.attachData();
  }
  private attachData() {
    // Create float array from provided vertices
    const floatArray = new Float32Array(this.vertices.length * Vertex.size);
    this.vertices.forEach((vertex, vertexIndex) => {
      const serializedVertex = vertex.serialize();
      const vertexStride = vertexIndex * Vertex.size;
      serializedVertex.forEach((value, valueIndex) => {
        floatArray[valueIndex + vertexStride] = value;
      });
    });

    // Bind buffer
    this.webGl2RenderingContext.bindBuffer(this.webGl2RenderingContext.ARRAY_BUFFER, this.buffer);
    this.webGl2RenderingContext.bufferData(this.webGl2RenderingContext.ARRAY_BUFFER, floatArray, this.webGl2RenderingContext.STATIC_DRAW);

    // Position
    this.webGl2RenderingContext.vertexAttribPointer(0, 3, this.webGl2RenderingContext.FLOAT, false, Vertex.bytesize, 0);
    this.webGl2RenderingContext.enableVertexAttribArray(0);

    // Normals
    this.webGl2RenderingContext.vertexAttribPointer(1, 3, this.webGl2RenderingContext.FLOAT, false, Vertex.bytesize, 3 * SizeOf.FLOAT);
    this.webGl2RenderingContext.enableVertexAttribArray(1);

    // Texture Coordinates
    this.webGl2RenderingContext.vertexAttribPointer(2, 2, this.webGl2RenderingContext.FLOAT, false, Vertex.bytesize, 6 * SizeOf.FLOAT);
    this.webGl2RenderingContext.enableVertexAttribArray(2);
  }
  destroy() {
    this.webGl2RenderingContext.deleteBuffer(this.buffer);
  }
}
