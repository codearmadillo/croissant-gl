import {croissantBackend} from "../lib/backend";
import {defaultCamera} from "../lib/graphics/camera";
import {EventType} from "../lib/types/events";
import {eventBroker} from "../lib/event-broker";
import {vec3, vec2} from "gl-matrix";
import {objectBroker} from "../lib/object-broker";
import {renderer} from "../lib/renderer";
import {DrawableType} from "../lib/graphics/drawable-type";
import {objectPropertiesBroker} from "../lib/object-properties-broker";
import {CameraInfo} from "../lib/types/camera";
import {ObjectInfo} from "../lib/types/object";
import {DebugInfo} from "../lib/types/debug";

export function bootstrap(canvas: HTMLCanvasElement) {
  croissantBackend.bootstrap(canvas);
}
export function stop() {
  croissantBackend.stop();
}
export function start() {
  croissantBackend.start();
}
export function ready() {
  return croissantBackend.ready;
}
export function on(eventType: EventType, callback: (...args: any[]) => any) {
  eventBroker.registerCallback(eventType, callback);
}

export namespace scene {
  export function showAxes(showXZ: boolean, showXY: boolean, showYZ: boolean) {
    renderer.enableAxes(showXZ, showXY, showYZ);
  }
}

export namespace debug {
  export function info(): DebugInfo {
    return {
      entities: objectBroker.entityCount,
      renderPasses: renderer.passes
    }
  }
}

export namespace camera {
  export function translate(translation: vec3) {
    defaultCamera.translate(translation);
  }
  export function rotate(rotation: vec3) {
    defaultCamera.rotate(rotation);
  }
  export function setRotation(rotation: vec3) {
    defaultCamera.setRotation(rotation);
  }
  export function setTranslation(translation: vec3) {
    defaultCamera.setTranslation(translation);
  }
  export function perspective(fov: number, near: number, far: number) {
    defaultCamera.perspective(fov, near, far);
  }
  export function info(): CameraInfo {
    return defaultCamera.info();
  }
  export namespace focalPoint {
    export function translate(translation: vec3) {
      defaultCamera.translateFocalPoint(translation);
    }
    export function setTranslation(translation: vec3) {
      defaultCamera.setFocalPointTranslation(translation);
    }
  }
}

export namespace object {
  export function create(type: DrawableType): number {
    const entity = objectBroker.create();
    // Add entity to properties broker
    objectPropertiesBroker.create(entity, type);
    // Add entity to renderer - Configuration will follow later
    renderer.create(entity, type);
    return entity;
  }
  export function info(object: number): ObjectInfo {
    return {
      id: object,
      type: objectPropertiesBroker.getType(object),
      translation: objectPropertiesBroker.getTranslation(object),
      rotation: objectPropertiesBroker.getRotation(object),
      scale: objectPropertiesBroker.getScale(object),
      enabled: objectPropertiesBroker.getEnabled(object)
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
}