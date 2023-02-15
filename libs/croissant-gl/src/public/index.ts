import {croissantBackend} from "../lib/backend";
import {defaultCamera} from "../lib/graphics/camera";
import {EventType} from "../lib/types/events";
import {eventBroker} from "../lib/event-broker";
import {vec3} from "gl-matrix";
import {objectBroker} from "../lib/object-broker";
import {renderer} from "../lib/renderer";
import {DrawableType} from "../lib/graphics/drawable-type";
import {objectPropertiesBroker} from "../lib/object-properties-broker";
import {CameraInfo} from "../lib/types/camera";
import {ObjectInfo} from "../lib/types/object";
import {DebugInfo} from "../lib/types/debug";

/**
 * Bootstraps renderer to provided canvas and starts the renderer.
 * @param canvas Canvas to bootstrap renderer context to
 */
export function bootstrap(canvas: HTMLCanvasElement) {
  croissantBackend.bootstrap(canvas);
}

/**
 * Stops renderer. The renderer context is not cleared, only rendering to canvas to suspended.
 */
export function stop() {
  croissantBackend.stop();
}

/**
 * Restarts rendering to canvas.
 */
export function start() {
  croissantBackend.start();
}

/**
 * Returns `boolean` indicating whether or not is rendering context ready.
 */
export function ready() {
  return croissantBackend.ready;
}

/**
 * Adds event listener that fires on renderer event
 * @param eventType Type of event
 * @param callback Callback to be called on event
 */
export function on(eventType: EventType, callback: (...args: any[]) => any) {
  eventBroker.registerCallback(eventType, callback);
}

export namespace scene {
  /**
   * Enables/disables individual axis planes
   * @param showXZ Show XZ plane
   * @param showXY Show XY plane
   * @param showYZ Show YZ plane
   */
  export function showAxes(showXZ: boolean, showXY: boolean, showYZ: boolean) {
    renderer.enableAxes(showXZ, showXY, showYZ);
  }
}

export namespace debug {
  /**
   * Returns information about current application state
   */
  export function info(): DebugInfo {
    return {
      entities: objectBroker.entityCount,
      renderPasses: renderer.passes
    }
  }
}

export namespace camera {
  /**
   * Changes camera translation by provided value
   * @param translation Value to translate by
   */
  export function translate(translation: vec3) {
    defaultCamera.translate(translation);
  }
  /**
   * Changes camera rotation by provided value
   * @param rotation Value to rotate by
   */
  export function rotate(rotation: vec3) {
    defaultCamera.rotate(rotation);
  }

  /**
   * Changes camera rotation to provided value
   * @param rotation New camera rotation value
   */
  export function setRotation(rotation: vec3) {
    defaultCamera.setRotation(rotation);
  }

  /**
   * Changes camera translation to provided value
   * @param translation New camera translation value
   */
  export function setTranslation(translation: vec3) {
    defaultCamera.setTranslation(translation);
  }

  /**
   * Changes camera mode to either perspective or orthographic
   * @param mode Camera mode - Perspective or Orthographic
   */
  export function setMode(mode: 'perspective' | 'orthographic') {
    defaultCamera.setMode(mode);
  }

  /**
   * Changes near/far clip planes for camera
   * @param near Near clipping plane
   * @param far Far clipping plane
   */
  export function setClipPlanes(near: number, far: number) {
    defaultCamera.setClipPlanes(near, far);
  }

  /**
   * Changes the field of view of perspective camera
   * @param angleInDegrees New field of view in degrees
   */
  export function setPerspectiveFieldOfView(angleInDegrees: number) {
    defaultCamera.setPerspectiveFieldOfView(angleInDegrees);
  }

  /**
   * Returns current camera info
   */
  export function info(): CameraInfo {
    return defaultCamera.info();
  }
  export namespace focalPoint {
    /**
     * Moves camera's focal point by provided value
     * @param translation Value to move focal point by
     */
    export function translate(translation: vec3) {
      defaultCamera.translateFocalPoint(translation);
    }

    /**
     * Sets new translation for camera's focal point
     * @param translation New focal point translation
     */
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