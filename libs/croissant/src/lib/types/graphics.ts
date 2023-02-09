import { Vec3 } from "./alg";
import { SizeOf } from "./sizeof";

export type ShaderSource = string;
export interface Drawable {
  draw(): void;
}
export class Vertex {
  readonly position: Vec3.Vec3;
  readonly color: Vec3.Vec3;

  // Float size of vector
  static get size() {
    return 6;
  }

  static get bytesize() {
    return this.size * SizeOf.FLOAT;
  }

  constructor(position: Vec3.Vec3, color: Vec3.Vec3 = [ 0.0, 0.0, 0.0 ]) {
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
