import {gl, WebGL2} from "./graphics/context";
import {defaultShader} from "./implementation/shader.default";
import { defaultCamera} from "./graphics/camera";
import {Drawable} from "./types/graphics";
import {Constants} from "./constants";

class CroissantBackend {
  public readonly drawables: Drawable[] = [];
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
    this.bootstrapped = true;
    // initialize webgl2 context
    WebGL2.setContextFromCanvas(canvas);
    // initialize shader
    defaultShader.bootstrap();
    // initialize camera
    defaultCamera.bootstrap();
    // initialize presets
    gl().enable(gl().DEPTH_TEST);
    // frame
    this.lastFrame = new Date().getTime();
    // start rendering loop
    this.drawScene();
  }
  stop() {
    this.running = false;
  }
  start() {
    this.running = true;
  }
  private drawScene() {
    setInterval(() => {
      // calculate deltaTime
      const now = new Date().getTime() * 0.001;
      const deltaTime = now - this.lastFrame;
      this.lastFrame = now;
      // clear canvas
      gl().clearColor(1, 1, 1, 1);
      gl().clear(gl().COLOR_BUFFER_BIT | gl().DEPTH_BUFFER_BIT);
      // exit if nothing is being rendered
      if (!this.running) {
        return;
      }
      // update objects
      this.drawables.forEach((drawable) => {
        drawable.frame(deltaTime);
      });
      // bind viewport and camera
      defaultCamera.bind();
      // render drawables
      this.drawables.forEach((drawable) => {
        drawable.draw();
      });
    }, 1000 / 5);
  }
}
export const croissantBackend = new CroissantBackend();
