import {Shader} from "../renderer/shader";
import {ShaderSource} from "../renderer/types";
import {gl} from "../renderer/context";

const fragmentShaderSource: ShaderSource = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec3 vertColor;

void main() {
  fragColor = vec4(vertColor, 1.0);
}
`;

const vertexShaderSource: ShaderSource = `#version 300 es
layout (location = 0) in vec4 a_Position;
layout (location = 1) in vec3 a_Color;

out vec3 vertColor;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

void main() {
  gl_Position = a_Position * u_model;
  vertColor = a_Color;
}
`;

export class DefaultShader extends Shader {
  constructor() {
    super();
    this.defineSource(fragmentShaderSource, gl().FRAGMENT_SHADER);
    this.defineSource(vertexShaderSource, gl().VERTEX_SHADER);
    this.compile();
  }
}
