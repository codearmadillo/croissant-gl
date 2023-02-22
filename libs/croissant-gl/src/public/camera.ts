import {renderer} from "../lib/renderer";
import {CameraInfo} from "../lib/types/camera";
import {vec3} from "gl-matrix";

/**
 * Sets camera height
 * @param height Camera height
 */
export function setHeight(height: number) {
    renderer.setCameraHeight(height);
}

/**
 * Sets camera distance from focal point
 * @param distance Distance from focal point
 */
export function setDistance(distance: number) {
    renderer.setCameraDistance(distance);
}

/**
 * Sets camera orbit angle relative to focal point
 * @param degrees Orbit angle in degrees
 */
export function setOrbitAngle(degrees: number) {
    renderer.setCameraOrbitAngle(degrees);
}

/**
 * Changes near/far clip planes for camera
 * @param near Near clipping plane
 * @param far Far clipping plane
 */
export function setClipPlanes(near: number, far: number) {
    renderer.setCameraClipPlanes(near, far);
}

/**
 * Changes the field of view of perspective camera
 * @param angleInDegrees New field of view in degrees
 */
export function setFieldOfView(angleInDegrees: number) {
    renderer.setCameraFieldOfView(angleInDegrees);
}

/**
 * Returns current camera info
 */
export function info(): CameraInfo {
    return renderer.getCameraInfo();
}

/**
 * Moves camera's focal point by provided value
 * @param translation Value to move focal point by
 */
export function translateFocusPoint(translation: vec3) {
    renderer.translateCameraFocusPoint(translation);
}
/**
 * Sets new translation for camera's focal point
 * @param translation New focal point translation
 */
export function setFocusPointTranslation(translation: vec3) {
    renderer.setCameraFocusPoint(translation);
}