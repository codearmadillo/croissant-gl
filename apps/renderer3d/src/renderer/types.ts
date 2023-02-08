export type ShaderSource = string;
export interface Drawable {
  draw(): void;
}

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
//#endregion
