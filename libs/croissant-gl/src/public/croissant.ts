import {Drawable} from "../lib/types/graphics";
import {gl, WebGL2} from "../lib/graphics/context";
import {Constants} from "../lib/constants";
import {defaultShader} from "../lib/implementation/shader.default";

let rendering = false;
let bootstrapped = false;
const drawables: Drawable[] = [];

export function bootstrap(canvas: HTMLCanvasElement) {
  WebGL2.setContextFromCanvas(canvas);
  gl().clearColor(1, 1, 1, 1);
  defaultShader.bootstrap();
  setInterval(() => {
    defaultShader.bind();
    gl().clear(gl().COLOR_BUFFER_BIT | gl().DEPTH_BUFFER_BIT);
    if (!rendering) {
      return;
    }
    drawables.forEach((d) => d.draw());
  }, 1000 / Constants.TARGET_FRAMES);
  bootstrapped = true;
}
export function ready() {
  return bootstrapped;
}
export function start() {
  rendering = true;
}
export function stop() {
  rendering = false;
}
export function addDrawable(drawable: Drawable) {
  drawables.push(drawable);
}
