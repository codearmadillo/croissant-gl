import {quat, vec3} from "gl-matrix";
import {ShaderType} from "./graphics";


export interface EntityTransform {
    scale: vec3;
    translation: vec3;
    rotation: vec3;
    rotationQuat: quat;
}
export interface EntityMaterial {
    color: vec3;
    shader: ShaderType;
}
export interface EntityMeta {
    type: string;
    enabled: boolean;
}