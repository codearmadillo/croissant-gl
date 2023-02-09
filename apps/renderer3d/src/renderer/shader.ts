import {gl} from "./context";

export interface ShaderProgram {
  bind(): void;
  unbind(): void;
}

export abstract class Shader implements ShaderProgram {
  private _uniformLocations: Map<string, WebGLUniformLocation> = new Map();
  private _shaders: Map<GLenum, WebGLProgram> = new Map();
  private _program: WebGLProgram | null = null;
  public get program() {
    return this._program;
  }
  private set program(value: WebGLProgram | null) {
    this._program = value;
  }
  protected compile(): void {
    this.program = gl.createProgram();
    if (this.program === null) {
      throw new Error(`Failed to create shader program`);
    }
    this._shaders.forEach((shader) => {
      gl.attachShader(this.program as WebGLProgram, shader);
    });
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(`Failed to link shader program - ${gl.getProgramInfoLog(this.program)}`);
    }
    this._shaders.forEach((shader) => {
      gl.deleteShader(shader);
    });
  }
  protected defineSource(source: string, type: GLenum) {
    if (this._shaders.has(type)) {
      throw new Error(`Failed to create shader of type '${type}' - Multiple shader sources of the same type are not supported`);
    }
    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error(`Failed to create shader of type '${type}'`);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`Failed to compile shader of type '${type}': ${gl.getShaderInfoLog(shader)}`);
    }

    this._shaders.set(type, shader);
  }
  public bind() {
    gl.useProgram(this.program);
  }
  public unbind() {
    gl.useProgram(null);
  }
  public getUniformLocation(name: string): WebGLUniformLocation {
    if (!this._uniformLocations.has(name)) {
      const location = gl.getUniformLocation(this.program as WebGLProgram, name);
      if (location === null) {
        throw new Error("Failed to obtain uniform location");
      } else {
        this._uniformLocations.set(name, location);
      }
    }
    return this._uniformLocations.get(name) as WebGLUniformLocation;
  }
}
