export type ShaderSource = string;

export namespace Math {
  export type Vec3 = [ x: number, y: number, z: number ];
  export type Vec4 = [ x: number, y: number, z: number, w: number ];
}

//#region Rendering
export class Vertex {
  readonly position: Math.Vec3;

  // Float size of vector
  static get size() {
    return 3;
  }

  constructor(position: Math.Vec3) {
    this.position = position;
  }
}
export class VertexArray {
  private readonly vertices: Vertex[];
  constructor(vertices: Vertex[]) {
    this.vertices = vertices;
  }
  asFloat32Array(): Float32Array {
    const floatArray = new Float32Array(this.vertices.length * Vertex.size);
    this.vertices.forEach((vertex, index) => {
      // Position
      floatArray[index * Vertex.size] = vertex.position[0];
      floatArray[1 + index * Vertex.size] = vertex.position[1];
      floatArray[2 + index * Vertex.size] = vertex.position[2];
    });
    return floatArray;
  }
}
//#endregion
