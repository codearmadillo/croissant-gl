import { SizeOf } from "./sizeof";
import * as glMatrix from 'gl-matrix';

export class Vertex {
  readonly position: glMatrix.vec3;
  readonly color: glMatrix.vec4;

  // Float size of vector
  static get size() {
    return 7;
  }

  static get bytesize() {
    return this.size * SizeOf.FLOAT;
  }

  constructor(position: glMatrix.vec3, color: glMatrix.vec4 = [ 0.0, 0.0, 0.0, 1.0 ]) {
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
