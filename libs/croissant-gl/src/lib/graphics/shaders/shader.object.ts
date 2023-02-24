import {Shader} from "../shader";
import {ShaderProgram} from "../../types/graphics";

const fragmentShaderSource = `#version 300 es
precision highp float;

out vec4 fragColor;

in vec4 v_Color;
in vec3 v_Normal;
in vec3 v_LightPosition;
in vec3 v_LightColor;
in highp vec2 v_textureCoordinates;

uniform sampler2D u_materialTexture;
uniform int u_materialTextureUsed;

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

  // define default color
  vec4 vertColor = v_Color;

  // apply texture
  if (u_materialTextureUsed == 1) {
    vec4 textureColor = texture(u_materialTexture, v_textureCoordinates);
    vertColor = vec4(textureColor.rgb * vertColor.rgb, vertColor.a);
  }

  // combine diffuse light and ambient light
  vec3 calculatedFragmentColor = (ambientLight + diffuseColor) * vertColor.rgb;

  // vec4 normalHeight = texture2D(m_NormalMap, texCoord);
  // vec3 normal = normalize(normalHeight.xyz);
  // negative values case
  // vec3 normal = normalize( (normalHeight.xyz * 2.0) - 1.0 );

  // output
  fragColor = vec4(calculatedFragmentColor, vertColor.a);;
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
uniform vec3 u_lightPosition;
uniform vec3 u_lightColor;
uniform vec3 u_materialColor;

out vec4 v_Color;
out vec3 v_Normal;
out vec3 v_FragPos;
out vec3 v_LightPosition;
out vec3 v_LightColor;
out vec2 v_textureCoordinates;

void main() {
  v_Color = vec4(u_materialColor * a_VertexColor, 1.0);
  v_FragPos = vec3(u_model * vec4(a_Position.xyz, 1.0));
  v_Normal = a_Normal;
  v_LightPosition = u_lightPosition;
  v_LightColor = u_lightColor;
  v_textureCoordinates = a_TextureCoords;

  gl_Position = u_projection * u_view * u_model * vec4(a_Position.xyz, 1.0);
}
`;

export class ObjectShader extends Shader implements ShaderProgram {
  protected getVertexShaderSource(): string {
    return vertexShaderSource;
  }
  protected getFragmentShaderSource(): string {
    return fragmentShaderSource;
  }
}
