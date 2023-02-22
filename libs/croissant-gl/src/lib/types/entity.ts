import {quat, vec3} from "gl-matrix";
import {ShaderType} from "./graphics";
import {Texture} from "./texture";


export interface EntityTransform {
    scale: vec3;
    translation: vec3;
    rotation: vec3;
    rotationQuat: quat;
}
export interface EntityMaterial {
    color: vec3;
    shader: ShaderType;
    texture?: Texture | null;
}
export interface EntityMeta {
    type: string;
    enabled: boolean;
}
