import {Shader} from "../shader";
import {ShaderProgram} from "../../types/graphics";

const fragmentShaderSource = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec4 v_Color;

void main() {
  fragColor = v_Color;
}
`;

const vertexShaderSource = `#version 300 es
layout (location = 0) in vec4 a_Position;
layout (location = 1) in vec3 a_Normal;
layout (location = 2) in vec2 a_TextureCoords;
layout (location = 3) in vec3 a_VertexColor;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform vec3 u_materialColor;

out vec4 v_Color;

void main() {
  v_Color = vec4(u_materialColor * a_VertexColor, 1.0);
  gl_Position = u_projection * u_view * u_model * vec4(a_Position.xyz, 1.0);
}
`;

export class UiShader extends Shader implements ShaderProgram {
  protected getVertexShaderSource(): string {
    return vertexShaderSource;
  }
  protected getFragmentShaderSource(): string {
    return fragmentShaderSource;
  }
}
