import { SizeOf } from "./sizeof";
import * as glMatrix from 'gl-matrix';

export type ShaderSource = string;
export interface Drawable {
  draw(): void;
}
export class Vertex {
  readonly position: glMatrix.vec3;
  readonly color: glMatrix.vec3;

  // Float size of vector
  static get size() {
    return 6;
  }

  static get bytesize() {
    return this.size * SizeOf.FLOAT;
  }

  constructor(position: glMatrix.vec3, color: glMatrix.vec3 = [ 0.0, 0.0, 0.0 ]) {
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
