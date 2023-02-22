import {gl} from "./context";
import {ShaderProgram} from "../types/graphics";

const fragmentShaderSource = `#version 300 es
precision highp float;

out vec4 fragColor;

in vec4 v_Color;
in vec3 v_Normal;
in vec3 v_LightPosition;
in vec3 v_LightColor;

// Fragment position in world-space without view/projection
in vec3 v_FragPos;

void main() {
  float ambientStrength = 0.25;
  vec3 ambientLight = ambientStrength * v_LightColor;

  // normalize normals and light direction vector - we dont care about distance of the light source
  vec3 normal = normalize(v_Normal);
  vec3 lightDirection = normalize(v_LightPosition - v_FragPos);

  // calculate diffuse - angle between normal vector and light vector. If they are perpendicular, it should be 1
  // use max method to ensure we do not get negative values
  float diffuse = max(dot(normal, lightDirection), 0.0);
  vec3 diffuseColor = diffuse * v_LightColor;

  // combine diffuse light and ambient light
  vec3 calculatedFragmentColor = (ambientLight + diffuseColor) * v_Color.rgb;

  // output
  fragColor = vec4(calculatedFragmentColor, v_Color.a);
}
`;

const vertexShaderSource = `#version 300 es
layout (location = 0) in vec4 a_Position;
layout (location = 1) in vec4 a_Color;
layout (location = 2) in vec3 a_Normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform vec3 u_lightPosition;
uniform vec3 u_lightColor;
uniform vec3 u_vertexColor;

out vec4 v_Color;
out vec3 v_Normal;
out vec3 v_FragPos;
out vec3 v_LightPosition;
out vec3 v_LightColor;

void main() {
  v_Color = vec4(u_vertexColor, 1.0);
  v_FragPos = vec3(u_model * vec4(a_Position.xyz, 1.0));
  v_Normal = a_Normal;
  v_LightPosition = u_lightPosition;
  v_LightColor = u_lightColor;

  gl_Position = u_projection * u_view * u_model * vec4(a_Position.xyz, 1.0);
}
`;

class Shader implements ShaderProgram {
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
    this.program = gl().createProgram();
    if (this.program === null) {
      throw new Error(`Failed to create shader program`);
    }
    this._shaders.forEach((shader) => {
      gl().attachShader(this.program as WebGLProgram, shader);
    });
    gl().linkProgram(this.program);
    if (!gl().getProgramParameter(this.program, gl().LINK_STATUS)) {
      throw new Error(`Failed to link shader program - ${gl().getProgramInfoLog(this.program)}`);
    }
    this._shaders.forEach((shader) => {
      gl().deleteShader(shader);
    });
  }
  protected defineSource(source: string, type: GLenum) {
    if (this._shaders.has(type)) {
      throw new Error(`Failed to create shader of type '${type}' - Multiple shader sources of the same type are not supported`);
    }
    const shader = gl().createShader(type);
    if (!shader) {
      throw new Error(`Failed to create shader of type '${type}'`);
    }
    gl().shaderSource(shader, source);
    gl().compileShader(shader);

    if (!gl().getShaderParameter(shader, gl().COMPILE_STATUS)) {
      throw new Error(`Failed to compile shader of type '${type}': ${gl().getShaderInfoLog(shader)}`);
    }

    this._shaders.set(type, shader);
  }
  public bootstrap() {
    this.defineSource(fragmentShaderSource, gl().FRAGMENT_SHADER);
    this.defineSource(vertexShaderSource, gl().VERTEX_SHADER);
    this.compile();
  }
  public bind() {
    gl().useProgram(this.program);
  }
  public unbind() {
    gl().useProgram(null);
  }
  public getUniformLocation(name: string): WebGLUniformLocation {
    if (!this._uniformLocations.has(name)) {
      const location = gl().getUniformLocation(this.program as WebGLProgram, name);
      if (location === null) {
        console.error(`Failed to obtain uniform location '${name}'`);
      } else {
        this._uniformLocations.set(name, location);
      }
    }
    return this._uniformLocations.get(name) as WebGLUniformLocation ?? null;
  }
}

export const defaultShader = new Shader();
