import {renderer} from "../lib/renderer";
import {vec3} from "gl-matrix";

/**
 * Enables/disables individual axis planes
 * @param showXZ Show XZ plane
 * @param showXY Show XY plane
 * @param showYZ Show YZ plane
 */
export function showAxes(showXZ: boolean, showXY: boolean, showYZ: boolean) {
    renderer.enableAxes(showXZ, showXY, showYZ);
}

/**
 * Sets scene clear (background) color
 * @param rgb Color in RGB format
 */
export function setClearColor(rgb: vec3) {
    renderer.setClearColor(rgb);
}