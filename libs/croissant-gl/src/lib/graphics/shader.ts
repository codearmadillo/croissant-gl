import {ShaderProgram} from "../types/graphics";

export abstract class Shader implements ShaderProgram {
  private _uniformLocations: Map<string, WebGLUniformLocation> = new Map();
  private _shaders: Map<GLenum, WebGLProgram> = new Map();
  private _program: WebGLProgram | null = null;
  private _webGl2RenderingContext: WebGL2RenderingContext;

  public get program() {
    return this._program;
  }
  private set program(value: WebGLProgram | null) {
    this._program = value;
  }

  protected abstract getVertexShaderSource(): string;
  protected abstract getFragmentShaderSource(): string;

  protected compile(): void {
    this.program = this._webGl2RenderingContext.createProgram();
    if (this.program === null) {
      throw new Error(`Failed to create shader program`);
    }
    this._shaders.forEach((shader) => {
      this._webGl2RenderingContext.attachShader(this.program as WebGLProgram, shader);
    });
    this._webGl2RenderingContext.linkProgram(this.program);
    if (!this._webGl2RenderingContext.getProgramParameter(this.program, this._webGl2RenderingContext.LINK_STATUS)) {
      throw new Error(`Failed to link shader program - ${this._webGl2RenderingContext.getProgramInfoLog(this.program)}`);
    }
    this._shaders.forEach((shader) => {
      this._webGl2RenderingContext.deleteShader(shader);
    });
  }
  protected defineSource(source: string, type: GLenum) {
    if (this._shaders.has(type)) {
      throw new Error(`Failed to create shader of type '${type}' - Multiple shader sources of the same type are not supported`);
    }
    const shader = this._webGl2RenderingContext.createShader(type);
    if (!shader) {
      throw new Error(`Failed to create shader of type '${type}'`);
    }
    this._webGl2RenderingContext.shaderSource(shader, source);
    this._webGl2RenderingContext.compileShader(shader);

    if (!this._webGl2RenderingContext.getShaderParameter(shader, this._webGl2RenderingContext.COMPILE_STATUS)) {
      throw new Error(`Failed to compile shader of type '${type}': ${this._webGl2RenderingContext.getShaderInfoLog(shader)}`);
    }

    this._shaders.set(type, shader);
  }
  public bootstrap(webGL2RenderingContext: WebGL2RenderingContext) {
    this._webGl2RenderingContext = webGL2RenderingContext;
    this.defineSource(this.getFragmentShaderSource(), this._webGl2RenderingContext.FRAGMENT_SHADER);
    this.defineSource(this.getVertexShaderSource(), this._webGl2RenderingContext.VERTEX_SHADER);
    this.compile();
  }
  public bind() {
    this._webGl2RenderingContext.useProgram(this.program);
  }
  public unbind() {
    this._webGl2RenderingContext.useProgram(null);
  }
  public getUniformLocation(name: string): WebGLUniformLocation {
    if (!this._uniformLocations.has(name)) {
      const location = this._webGl2RenderingContext.getUniformLocation(this.program as WebGLProgram, name);
      if (location === null) {
        console.warn(`Failed to obtain uniform location '${name}'`);
      } else {
        this._uniformLocations.set(name, location);
      }
    }
    return this._uniformLocations.get(name) as WebGLUniformLocation ?? null;
  }
  public destroy() {
    this._webGl2RenderingContext.deleteProgram(this._program);
  }
}
