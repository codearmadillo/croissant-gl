import {gl, WebGL2} from "./graphics/context";
import { defaultCamera} from "./graphics/camera";
import {defaultShader} from "./graphics/shader";
import {Drawable} from "./types/drawable";

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
      // bind viewport and camera
      defaultCamera.bind();
      // render drawables
      this.drawables.forEach((drawable) => {
        if (drawable.enabled) {
          drawable.draw();
        }
      });
    }, 1000 / 15);
  }
}
export const croissantBackend = new CroissantBackend();
