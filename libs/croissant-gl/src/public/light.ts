import {vec3} from "gl-matrix";
import {contextBroker} from "../lib/context-broker";

/**
 * Sets color of the light to provided RGB values
 * @param context CroissantGl context
 * @param color RGB values
 */
export function setColor(context: number, color: vec3) {
    contextBroker.getOrThrow(context).renderer.light.setColor(color);
}

/**
 * Translates light to provided position
 * @param context CroissantGl context
 * @param translation New translation value
 */
export function setTranslation(context: number, translation: vec3) {
    contextBroker.getOrThrow(context).renderer.light.setTranslation(translation);
}

/**
 * Translates light by provided value
 * @param context CroissantGl context
 * @param translation Translation value
 */
export function translate(context: number, translation: vec3) {
    contextBroker.getOrThrow(context).renderer.light.translate(translation);
}

/**
 * Returns information about light
 * @param context CroissantGl context
 */
export function info(context: number) {
    return contextBroker.getOrThrow(context).renderer.light.info();
}
