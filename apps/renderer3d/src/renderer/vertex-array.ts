import {TypeSize, Vertex} from "./types";
import {gl} from "./context";

export class VertexArray {
  private readonly buffer: WebGLBuffer | null;
  private readonly vertices: Vertex[];
  constructor(vertices: Vertex[]) {
    this.vertices = vertices;
    this.buffer = gl().createBuffer();
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
    gl().bindBuffer(gl().ARRAY_BUFFER, this.buffer);
    gl().bufferData(gl().ARRAY_BUFFER, floatArray, gl().STATIC_DRAW);

    // Position
    gl().vertexAttribPointer(0, 3, gl().FLOAT, false, Vertex.bytesize, 0);
    gl().enableVertexAttribArray(0);

    // Color
    gl().vertexAttribPointer(1, 3, gl().FLOAT, false, Vertex.bytesize, 3 * TypeSize.FLOAT);
    gl().enableVertexAttribArray(1);
  }
}
