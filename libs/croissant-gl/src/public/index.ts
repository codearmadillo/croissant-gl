import {croissantBackend} from "../lib/backend";
import {defaultCamera} from "../lib/graphics/camera";
import {EventType} from "../lib/types/events";
import {eventBroker} from "../lib/event-broker";
import {vec3, vec2} from "gl-matrix";
import {objectBroker} from "../lib/object-broker";
import {renderer} from "../lib/renderer";
import {DrawableType} from "../lib/graphics/drawable-type";
import {objectPropertiesBroker} from "../lib/object-properties-broker";

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

export namespace camera {
  export function translate(x: number, y: number, z: number) {
    defaultCamera.translate(x, y, z);
  }
  export function rotate(xDegrees: number, yDegrees: number, zDegrees: number) {
    defaultCamera.rotate(xDegrees, yDegrees, zDegrees);
  }
  export function perspective(fov: number, near: number, far: number) {
    defaultCamera.perspective(fov, near, far);
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
  export function translate(object: number, translation: vec3) {
    objectPropertiesBroker.translate(object, translation);
  }
  export function rotate(object: number, rotation: vec3) {
    objectPropertiesBroker.rotate(object, rotation);
  }
  export function scale(object: number, scale: vec3) {
    objectPropertiesBroker.scale(object, scale);
  }
}