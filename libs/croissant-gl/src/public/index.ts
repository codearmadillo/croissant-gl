import {croissantBackend} from "../lib/backend";
import {EventType} from "../lib/types/events";
import {eventBroker} from "../lib/brokers/event-broker";

//////////////////////////////////////////////////////////
// TOP-LEVEL API
//////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////
// DEPENDENCIES
//////////////////////////////////////////////////////////
export * as light from "./light";
export * as scene from "./scene";
export * as debug from "./debug";
export * as camera from "./camera";
export * as object from "./object";
export * as texture from "./texture";
