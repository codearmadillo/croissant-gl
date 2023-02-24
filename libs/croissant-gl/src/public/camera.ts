import {CameraInfo} from "../lib/types/camera";
import {vec3} from "gl-matrix";
import {contextBroker} from "../lib/context-broker";

/**
 * Sets camera height
 * @param context CroissantGl context
 * @param height Camera height
 */
export function setHeight(context: number, height: number) {
  contextBroker.getOrThrow(context)?.renderer.setCameraHeight(height);
}

/**
 * Sets camera distance from focal point
 * @param context CroissantGl context
 * @param distance Distance from focal point
 */
export function setDistance(context: number, distance: number) {
    contextBroker.getOrThrow(context)?.renderer.setCameraDistance(distance);
}

/**
 * Sets camera orbit angle relative to focal point
 * @param context CroissantGl context
 * @param degrees Orbit angle in degrees
 */
export function setOrbitAngle(context: number, degrees: number) {
    contextBroker.getOrThrow(context)?.renderer.setCameraOrbitAngle(degrees);
}

/**
 * Changes near/far clip planes for camera
 * @param context CroissantGl context
 * @param near New value for near clip plane
 */
export function setNearClipPlane(context: number, near: number) {
  contextBroker.getOrThrow(context)?.renderer.setCameraNearClipPlane(near);
}

/**
 * Changes near/far clip planes for camera
 * @param context CroissantGl context
 * @param far New value for far clip plane
 */
export function setFarClipPlane(context: number, far: number) {
  contextBroker.getOrThrow(context)?.renderer.setCameraFarClipPlane(far);
}

/**
 * Changes the field of view of perspective camera
 * @param context CroissantGl context
 * @param angleInDegrees New field of view in degrees
 */
export function setFieldOfView(context: number, angleInDegrees: number) {
    contextBroker.getOrThrow(context)?.renderer.setCameraFieldOfView(angleInDegrees);
}

/**
 * Returns current camera info
 * @param context CroissantGl context
 */
export function info(context: number): CameraInfo {
    return contextBroker.getOrThrow(context)?.renderer.getCameraInfo();
}

/**
 * Moves camera's focal point by provided value
 * @param context CroissantGl context
 * @param translation Value to move focal point by
 */
export function translateFocusPoint(context: number, translation: vec3) {
    contextBroker.getOrThrow(context)?.renderer.translateCameraFocusPoint(translation);
}
/**
 * Sets new translation for camera's focal point
 * @param context CroissantGl context
 * @param translation New focal point translation
 */
export function setFocusPointTranslation(context: number, translation: vec3) {
    contextBroker.getOrThrow(context)?.renderer.setCameraFocusPoint(translation);
}
