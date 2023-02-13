import {croissantBackend} from "../lib/backend";
import {defaultCamera} from "../lib/graphics/camera";
import {EventType} from "../lib/types/events";
import {eventBroker} from "../lib/event-broker";
import {vec3, vec2} from "gl-matrix";
import {Cube} from "../lib/graphics/drawables/cube";
import {SceneObject} from "../lib/types/scene-object";

export type CroissantSceneObject = SceneObject;

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
  export function rotateX(degrees: number) {
    defaultCamera.rotateX(degrees);
  }
  export function rotateY(degrees: number) {
    defaultCamera.rotateY(degrees);
  }
  export function rotateZ(degrees: number) {
    defaultCamera.rotateZ(degrees);
  }
  export function perspective_fov(degrees: number) {
    defaultCamera.setPerspectiveFov(degrees);
  }
  export function perspective_near(value: number) {
    defaultCamera.setPerspectiveNear(value);
  }
  export function perspective_far(value: number) {
    defaultCamera.setPerspectiveFar(value);
  }
}

export namespace create {
  export function cube(position: vec3, size: vec3): CroissantSceneObject {
    const object = new Cube(size, position);
    croissantBackend.drawables.push(object);
    return object;
  }
}
