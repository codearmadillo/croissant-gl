import {vec3} from "gl-matrix";

export interface CameraInfo {
    distance: number;
    orbitAngle: number;
    height: number;
    clipNear: number;
    clipFar: number;
    fieldOfView: number;
    focalPoint: vec3;
    perspective: boolean;
}
export interface Camera {
    focusPoint: vec3;
    distance: number;
    height: number;
    orbit: number;
    near: number;
    far: number;
    fov: number;
    dirty: boolean;
}