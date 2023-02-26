import {VertexArrayObject} from "./vertex-array-object";
import {vec3} from "gl-matrix";
import {ShaderType} from "../types/graphics";
import {Texture} from "../types/texture";

interface VertexGroupMaterial {
  color: vec3;
  shader: ShaderType;
  texture?: Texture | null;
}
export interface VertexGroup {
  vao: VertexArrayObject;
  material: VertexGroupMaterial;
}
