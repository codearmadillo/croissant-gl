import { SizeOf } from "./sizeof";
import * as glMatrix from 'gl-matrix';
import {vec3} from "gl-matrix";

export class Vertex {
  readonly position: glMatrix.vec3;
  readonly color: glMatrix.vec4;
  readonly normals: glMatrix.vec3;

  // Float size of vector
  static get size() {
    return 10;
  }

  static get bytesize() {
    return this.size * SizeOf.FLOAT;
  }

  constructor(position: glMatrix.vec3, normals: vec3, color: glMatrix.vec4 = [ 0.65, 0.65, 0.65, 1.0 ]) {
    this.position = position;
    this.color = color;
    this.normals = normals;
  }

  serialize(): number[] {
    return [
      ...this.position,
      ...this.color,
      ...this.normals
    ]
  }
}
