import {WebGL2} from "./graphics/context";
import {renderer} from "./renderer";
import {shaderBroker} from "./shader-broker";

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
    shaderBroker.bootstrap();
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
