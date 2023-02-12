import {ShaderSource} from "../types/graphics";
import {Shader} from "../graphics/shader";
import {gl} from "../graphics/context";

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

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec3 vertColor;

void main() {
  gl_Position = u_projection * u_view * u_model * vec4(a_Position.xyz, 1.0);
  vertColor = a_Color;
}
`;
class DefaultShader extends Shader {

  constructor() {
    super();
  }
  bootstrap() {
    this.defineSource(fragmentShaderSource, gl().FRAGMENT_SHADER);
    this.defineSource(vertexShaderSource, gl().VERTEX_SHADER);
    this.compile();
  }

}

export const defaultShader = new DefaultShader();
