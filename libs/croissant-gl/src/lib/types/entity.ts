import {quat, vec3} from "gl-matrix";


export interface EntityTransform {
    scale: vec3;
    translation: vec3;
    rotation: vec3;
    rotationQuat: quat;
}
export interface EntityMaterial {
    color: vec3;
    shader?: number;
}
export interface EntityMeta {
    type: string;
    enabled: boolean;
}