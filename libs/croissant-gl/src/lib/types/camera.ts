import {vec3} from "gl-matrix";

export interface CameraInfo {
    translation: vec3;
    rotation: vec3;
    clipNear: number;
    clipFar: number;
    angle: number;
    focalPoint: vec3;
    perspective: boolean;
}