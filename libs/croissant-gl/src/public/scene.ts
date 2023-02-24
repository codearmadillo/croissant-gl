import {vec3} from "gl-matrix";
import {contextBroker} from "../lib/context-broker";

/**
 * Enables/Disables grid
 * @param context CroissantGL context
 * @param showGrid Show grid
 */
export function setGridVisibility(context: number, showGrid: boolean) {
  contextBroker.getOrThrow(context).renderer.setGridVisibility(showGrid);
}

/**
 * Enables/Disables grid
 * @param context CroissantGL context
 * @param color Color in rgb format (0-255 range)
 */
export function setGridColor(context: number, color: vec3) {
  contextBroker.getOrThrow(context).renderer.setGridColor(color);
}

/**
 * Enables/Disables gimbal
 * @param context CroissantGL context
 * @param showGimbal Show gimbal
 */
export function setGimbalVisibility(context: number, showGimbal: boolean) {
  contextBroker.getOrThrow(context).renderer.setGimbalVisibility(showGimbal);
}

/**
 * Sets scene clear (background) color
 * @param context CroissantGl context
 * @param rgb Color in RGB format
 */
export function setClearColor(context: number, rgb: vec3) {
    contextBroker.getOrThrow(context).renderer.setClearColor(rgb);
}
