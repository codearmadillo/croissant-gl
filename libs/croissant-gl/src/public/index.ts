import {EventType} from "../lib/types/events";
import {contextBroker} from "../lib/context-broker";

//////////////////////////////////////////////////////////
// TOP-LEVEL API
//////////////////////////////////////////////////////////
export function createContext(canvas: HTMLCanvasElement) {
  return contextBroker.create(canvas);
}
export function destroyContext(context: number) {
  // Get context
  const ctx = contextBroker.getOrThrow(context);

  // Close renderer loop
  ctx.renderer.breakLoop();

  // Finalize object properties
  ctx.objectPropertiesBroker.finalize();

  // Finalize textures
  ctx.textureBroker.finalize();

  // Finalize shaders
  ctx.shaderBroker.finalize();

  // Finalize renderer
  ctx.renderer.finalize();

  // Finalize objects
  ctx.objectBroker.finalize();

  // Release context
  contextBroker.destroy(ctx.id);
}

/**
 * Bootstraps renderer to provided canvas and starts the renderer.
 * @param context CroissantGl context
 * @param canvas Canvas to bootstrap renderer context to
 */
export function bootstrap(context: number) {
  contextBroker.getOrThrow(context)?.bootstrap();
}

/**
 * Returns `boolean` indicating whether or not is rendering context ready.
 * @param context CroissantGl context
 */
export function ready(context: number) {
  return contextBroker.getOrThrow(context).ready;
}

/**
 * Adds event listener that fires on renderer event
 * @param context CroissantGl context
 * @param eventType Type of event
 * @param callback Callback to be called on event
 */
export function on(context: number, eventType: EventType, callback: (...args: any[]) => any) {
  contextBroker.getOrThrow(context)?.eventBroker.registerCallback(eventType, callback);
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
