import {DrawableType} from "../lib/graphics/drawable-type";
import {objectBroker} from "../lib/brokers/object-broker";
import {objectPropertiesBroker} from "../lib/brokers/object-properties-broker";
import {renderer} from "../lib/renderer";
import {ObjectInfo} from "../lib/types/object";
import {vec3} from "gl-matrix";
import {Texture} from "../lib/types/texture";

export function create(type: DrawableType): number {
    const entity = objectBroker.create();

    objectPropertiesBroker.entityCreated(entity, type);
    renderer.entityCreated(entity, type);

    return entity;
}
export function info(object: number): ObjectInfo {
    return {
        id: object,
        type: objectPropertiesBroker.getType(object),
        translation: objectPropertiesBroker.getTranslation(object),
        rotation: objectPropertiesBroker.getRotation(object),
        scale: objectPropertiesBroker.getScale(object),
        enabled: objectPropertiesBroker.isEntityEnabled(object)
    }
}
export function setTranslation(object: number, translation: vec3) {
    objectPropertiesBroker.setTranslation(object, translation);
}
export function setRotation(object: number, rotation: vec3) {
    objectPropertiesBroker.setRotation(object, rotation);
}
export function setScale(object: number, scale: vec3) {
    objectPropertiesBroker.setScale(object, scale);
}
export function translate(object: number, translation: vec3) {
    objectPropertiesBroker.translate(object, translation);
}
export function rotate(object: number, rotation: vec3) {
    objectPropertiesBroker.rotate(object, rotation);
}
export function scale(object: number, scale: vec3) {
    objectPropertiesBroker.scale(object, scale);
}
export function enable(object: number) {
    objectPropertiesBroker.enable(object);
}
export function disable(object: number) {
    objectPropertiesBroker.disable(object);
}
export function setTexture(object: number, texture: Texture | null) {
    objectPropertiesBroker.setMaterialTexture(object, texture);
}
