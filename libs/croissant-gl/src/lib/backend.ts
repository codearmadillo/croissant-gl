import {gl, WebGL2} from "./graphics/context";
import {defaultShader} from "./graphics/shader";
import {Drawable} from "./types/drawable";
import {renderer} from "./renderer";

class CroissantBackend {
  private running = true;
  private bootstrapped = false;
  private lastFrame: number;
  get ready() {
    return this.bootstrapped;
  }
  bootstrap(canvas: HTMLCanvasElement) {
    if (this.bootstrapped) {
      return;
    }
    // initialize webgl2 context
    WebGL2.setContextFromCanvas(canvas);
    // initialize shader
    defaultShader.bootstrap();
    // initialize renderer
    renderer.bootstrap();
    // frame
    this.lastFrame = new Date().getTime();
    // mark as bootstraped
    this.bootstrapped = true;
    // start rendering loop
    renderer.loop();
  }
  stop() {
    this.running = false;
  }
  start() {
    this.running = true;
  }
}
export const croissantBackend = new CroissantBackend();
