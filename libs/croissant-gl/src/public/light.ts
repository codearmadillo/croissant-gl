import {vec3} from "gl-matrix";
import {defaultLight} from "../lib/graphics/light";

/**
 * Sets color of the light to provided RGB values
 * @param color RGB values
 */
export function setColor(color: vec3) {
    defaultLight.setColor(color);
}

/**
 * Translates light to provided position
 * @param translation New translation value
 */
export function setTranslation(translation: vec3) {
    defaultLight.setTranslation(translation);
}

/**
 * Translates light by provided value
 * @param translation Translation value
 */
export function translate(translation: vec3) {
    defaultLight.translate(translation);
}

/**
 * Returns information about light
 */
export function info() {
    return defaultLight.info();
}