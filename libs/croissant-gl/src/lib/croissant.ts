import {gl, WebGL2} from "./graphics/context";
import {defaultShader} from "./implementation/shader.default";
import { defaultCamera} from "./graphics/camera";
import {Drawable} from "./types/graphics";
import {Constants} from "./constants";

class CroissantBackend {
  public readonly drawables: Drawable[] = [];
  private running = true;
  private bootstrapped = false;
  get ready() {
    return this.bootstrapped;
  }
  bootstrap(canvas: HTMLCanvasElement) {
    if (this.bootstrapped) {
      return;
    }
    this.bootstrapped = true;
    // initialize webgl2 context
    WebGL2.setContextFromCanvas(canvas);
    // initialize shader
    defaultShader.bootstrap();
    // initialize camera
    defaultCamera.bootstrap();
    // initialize presets
    gl().enable(gl().DEPTH_TEST);
    // start rendering loop
    this.startLoop();
  }
  stop() {
    this.running = false;
  }
  start() {
    this.running = true;
  }
  private startLoop() {
    setInterval(() => {
      // clear canvas
      gl().clearColor(1, 1, 1, 1);
      gl().clear(gl().COLOR_BUFFER_BIT | gl().DEPTH_BUFFER_BIT);
      // exit if nothing is being rendered
      if (!this.running) {
        return;
      }
      // bind viewport and camera
      defaultCamera.bind();
      // render drawables
      this.drawables.forEach((drawable) => {
        drawable.draw();
      });
    }, 1000 / Constants.TARGET_FRAMES);
  }
}
export const croissantBackend = new CroissantBackend();
