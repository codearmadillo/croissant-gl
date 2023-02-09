export type ShaderSource = string;
export interface Drawable {
  draw(): void;
}

export namespace Math {
  export type Vec3 = [ x: number, y: number, z: number ];
  export type Vec4 = [ x: number, y: number, z: number, w: number ];
  export type Mat4 = [ a1: Vec4, a2: Vec4, a3: Vec4, a4: Vec4 ];
  export class Mat4Utils {
    static identity(): Mat4 {
      return [
        [ 1, 0, 0, 0 ],
        [ 0, 1, 0, 0 ],
        [ 0, 0, 1, 0 ],
        [ 0, 0, 0, 1 ],
      ]
    }
    static toColumnArray(mat4: Mat4): number[] {
      const out = [];
      for (let column = 0; column < 4; column++) {
        for (let row = 0; row < 4; row++) {
          out.push(mat4[row][column]);
        }
      }
      return out;
    }
  }
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
