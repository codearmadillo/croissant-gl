import {croissantBackend} from "../lib/croissant";
import {Drawable} from "../lib/types/graphics";
import {defaultCamera} from "../lib/graphics/camera";

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
export function create(drawable: Drawable) {
  croissantBackend.drawables.push(drawable);
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
