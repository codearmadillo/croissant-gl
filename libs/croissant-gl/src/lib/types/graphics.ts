import { SizeOf } from "./sizeof";
import {vec2, vec3} from "gl-matrix";

export enum ShaderType {
  OBJECT_SHADER,
  UI_SHADER
}

export interface ShaderProgram {
  bind(): void;
  unbind(): void;
  bootstrap(webGL2RenderingContext: WebGL2RenderingContext): void;
  getUniformLocation(name: string): WebGLUniformLocation;
  destroy(): void;
}

export interface VertexCreateOptions {
  normals?: vec3 | null;
  textureCoordinates?: vec2 | null;
  color?: vec3 | null;
}

export class Vertex {
  readonly position: vec3;
  readonly normals: vec3;
  readonly textureCoordinates: vec2;
  readonly color: vec3;

  // Float size of vector
  static get size() {
    return 11;
  }

  static get bytesize() {
    return this.size * SizeOf.FLOAT;
  }

  constructor(position: vec3, options: VertexCreateOptions | null = null) {
    this.position = position;
    this.normals = options?.normals ?? [ 1, 1, 1 ];
    this.textureCoordinates = options?.textureCoordinates ?? [ 0, 0 ];
    if (options?.color) {
      this.color = [ options.color[0] / 255, options.color[1] / 255, options.color[2] / 255 ];
    } else {
      this.color = [ 1, 1, 1 ];
    }
  }

  serialize(): number[] {
    return [
      ...this.position,
      ...this.normals,
      ...this.textureCoordinates,
      ...this.color
    ]
  }
}
