export type ShaderSource = string;
export interface Drawable {
  draw(): void;
}

export namespace Math {
  export type Vec3 = [ x: number, y: number, z: number ];
  export type Vec4 = [ x: number, y: number, z: number, w: number ];
}

export enum TypeSize {
  FLOAT = 4
}

//#region Rendering
export class Vertex {
  readonly position: Math.Vec3;
  readonly color: Math.Vec3;

  // Float size of vector
  static get size() {
    return 6;
  }

  static get bytesize() {
    return this.size * TypeSize.FLOAT;
  }

  constructor(position: Math.Vec3, color: Math.Vec3 = [ 0.0, 0.0, 0.0 ]) {
    this.position = position;
    this.color = color;
  }

  serialize(): number[] {
    return [
      ...this.position,
      ...this.color
    ]
  }
}
//#endregion
