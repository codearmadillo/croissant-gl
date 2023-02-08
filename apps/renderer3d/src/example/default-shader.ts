import {Shader} from "../renderer/shader";
import {ShaderSource} from "../renderer/types";
import {gl} from "../renderer/context";

const fragmentShaderSource: ShaderSource = `#version 300 es
precision highp float;

out vec4 fragColor;

void main() {
  fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

const vertexShaderSource: ShaderSource = `#version 300 es
layout (location = 0) in vec4 a_Position;

void main() {
  gl_Position = a_Position;
}
`;

class DefaultShader extends Shader {
  constructor() {
    super();
    this.defineSource(fragmentShaderSource, gl.FRAGMENT_SHADER);
    this.defineSource(vertexShaderSource, gl.VERTEX_SHADER);
    this.compile();
  }
}

export const defaultShader = new DefaultShader();
