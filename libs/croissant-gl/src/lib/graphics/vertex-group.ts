import {VertexArrayObject} from "./vertex-array-object";
import {vec3} from "gl-matrix";
import {ShaderType} from "../types/graphics";
import {Texture} from "../types/texture";
import {VertexGroupMaterial} from "./vertex-group-material";

export interface VertexGroup {
  vao: VertexArrayObject;
  material: VertexGroupMaterial;
}
