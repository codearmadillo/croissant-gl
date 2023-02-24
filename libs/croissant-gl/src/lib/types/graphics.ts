import { SizeOf } from "./sizeof";
import * as glMatrix from 'gl-matrix';
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

export class Vertex {
  readonly position: vec3;
  readonly normals: vec3;
  readonly textureCoordinates: vec2;

  // Float size of vector
  static get size() {
    return 8;
  }

  static get bytesize() {
    return this.size * SizeOf.FLOAT;
  }

  constructor(position: vec3, normals: vec3, textureCoordinates: vec2) {
    this.position = position;
    this.normals = normals;
    this.textureCoordinates = textureCoordinates;
  }

  serialize(): number[] {
    return [
      ...this.position,
      ...this.normals,
      ...this.textureCoordinates
    ]
  }
}
