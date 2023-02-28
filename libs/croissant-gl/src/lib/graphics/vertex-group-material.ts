import {vec3} from "gl-matrix";
import {ShaderType} from "../types/graphics";
import {Texture} from "../types/texture";
import {MeshMaterialIllumination} from "../types/mesh";

export interface VertexGroupMaterial {
    specularExponent: number;
    illumination: MeshMaterialIllumination;
    ambient: vec3;
    diffuse: vec3;
    specular: vec3;
    shader: ShaderType;
    texture?: Texture | null;
}