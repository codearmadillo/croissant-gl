import {vec3} from "gl-matrix";
import {contextBroker} from "../lib/context-broker";

/**
 * Enables/disables individual axis planes
 * @param context CroissantGl context
 * @param showXZ Show XZ plane
 * @param showXY Show XY plane
 * @param showYZ Show YZ plane
 */
export function showAxes(context: number, showXZ: boolean, showXY: boolean, showYZ: boolean) {
    contextBroker.getOrThrow(context).renderer.enableAxes(showXZ, showXY, showYZ);
}

/**
 * Sets scene clear (background) color
 * @param context CroissantGl context
 * @param rgb Color in RGB format
 */
export function setClearColor(context: number, rgb: vec3) {
    contextBroker.getOrThrow(context).renderer.setClearColor(rgb);
}
