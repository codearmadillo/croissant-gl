import {vec3} from "gl-matrix";
import {contextBroker} from "../lib/context-broker";
import {ObjectCreateOptions} from "../lib/types/drawables";
import {Texture} from "../lib/types/texture";

/**
 * Creates new object of provided type
 * @param context CroissantGl context
 * @param options Create options
 */
export async function create(context: number, options: ObjectCreateOptions): Promise<number> {
  const ctx = contextBroker.getOrThrow(context);

  return ctx.objectBroker.createAsync(async (entity) => {
    ctx.objectPropertiesBroker.entityCreated(entity, options);
    await ctx.renderer.entityCreated(entity, options);
  });
}

/**
 * Destroys objects
 * @param context CroissantGl context
 * @param object Object to destroy
 */
export function destroy(context: number, object: number) {
  const ctx = contextBroker.getOrThrow(context);

  ctx.renderer.entityDestroyed(object);
  ctx.objectPropertiesBroker.entityDestroyed(object);
  ctx.objectBroker.destroy(object);
}

/**
 * Sets object translation
 * @param context CroissantGl context
 * @param object Object to modify
 * @param translation New translation value
 */
export function setTranslation(context: number, object: number, translation: vec3) {
  contextBroker.getOrThrow(context)?.objectPropertiesBroker.setTranslation(object, translation);
}

/**
 *
 * @param context CroissantGl context
 * @param object Object to modify
 * @param rotation New rotation value
 */
export function setRotation(context: number, object: number, rotation: vec3) {
  contextBroker.getOrThrow(context)?.objectPropertiesBroker.setRotation(object, rotation);
}

/**
 *
 * @param context CroissantGl context
 * @param object Object to modify
 * @param scale New scale value
 */
export function setScale(context: number, object: number, scale: vec3) {
  contextBroker.getOrThrow(context)?.objectPropertiesBroker.setScale(object, scale);
}

/**
 *
 * @param context CroissantGl context
 * @param object Object to modify
 * @param translation Translation
 */
export function translate(context: number, object: number, translation: vec3) {
  contextBroker.getOrThrow(context)?.objectPropertiesBroker.translate(object, translation);
}

/**
 *
 * @param context CroissantGl context
 * @param object Object to modify
 * @param rotation Rotation
 */
export function rotate(context: number, object: number, rotation: vec3) {
  contextBroker.getOrThrow(context)?.objectPropertiesBroker.rotate(object, rotation);
}

/**
 *
 * @param context CroissantGl context
 * @param object Object to modify
 * @param scale Scale
 */
export function scale(context: number, object: number, scale: vec3) {
  contextBroker.getOrThrow(context)?.objectPropertiesBroker.scale(object, scale);
}

/**
 * Sets new material color on object. This action will change material color on all materials associated with entity
 * @param context CroissantGl context
 * @param object Object to set material color on
 * @param color New color in rgb format (0-255 range)
 */
export function setMaterialColor(context: number, object: number, color: vec3) {
  contextBroker.getOrThrow(context)?.renderer.setEntityMaterialColor(object, color);
}

/**
 * Sets new material texture on object
 * @param context CroissantGl context
 * @param object Object to set material texture on
 * @param texture New texture
 */
export function setMaterialTexture(context: number, object: number, texture: Texture | null) {
  contextBroker.getOrThrow(context)?.renderer.setEntityMaterialTexture(object, texture);
}
