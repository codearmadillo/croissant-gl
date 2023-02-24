import {DrawableType} from "../lib/graphics/drawable-type";
import {ObjectInfo} from "../lib/types/object";
import {vec3} from "gl-matrix";
import {Texture} from "../lib/types/texture";
import {contextBroker} from "../lib/context-broker";

export function create(context: number, type: DrawableType): number {
  const ctx = contextBroker.getOrThrow(context);
    const entity = ctx.objectBroker.create();

    ctx.objectPropertiesBroker.entityCreated(entity, type);
    ctx.renderer.entityCreated(entity, type);

    return entity;
}
export function info(context: number, object: number): ObjectInfo {
    const ctx = contextBroker.getOrThrow(context);
    return {
        id: object,
        type: ctx.objectPropertiesBroker.getType(object),
        translation: ctx.objectPropertiesBroker.getTranslation(object),
        rotation: ctx.objectPropertiesBroker.getRotation(object),
        scale: ctx.objectPropertiesBroker.getScale(object),
        enabled: ctx.objectPropertiesBroker.isEntityEnabled(object)
    }
}
export function setTranslation(context: number, object: number, translation: vec3) {
    contextBroker.getOrThrow(context)?.objectPropertiesBroker.setTranslation(object, translation);
}
export function setRotation(context: number, object: number, rotation: vec3) {
    contextBroker.getOrThrow(context)?.objectPropertiesBroker.setRotation(object, rotation);
}
export function setScale(context: number, object: number, scale: vec3) {
    contextBroker.getOrThrow(context)?.objectPropertiesBroker.setScale(object, scale);
}
export function translate(context: number, object: number, translation: vec3) {
    contextBroker.getOrThrow(context)?.objectPropertiesBroker.translate(object, translation);
}
export function rotate(context: number, object: number, rotation: vec3) {
    contextBroker.getOrThrow(context)?.objectPropertiesBroker.rotate(object, rotation);
}
export function scale(context: number, object: number, scale: vec3) {
    contextBroker.getOrThrow(context)?.objectPropertiesBroker.scale(object, scale);
}
export function enable(context: number, object: number) {
    contextBroker.getOrThrow(context)?.objectPropertiesBroker.enable(object);
}
export function disable(context: number, object: number) {
    contextBroker.getOrThrow(context)?.objectPropertiesBroker.disable(object);
}
export function setTexture(context: number, object: number, texture: Texture | null) {
    contextBroker.getOrThrow(context)?.objectPropertiesBroker.setMaterialTexture(object, texture);
}
