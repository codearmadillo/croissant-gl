import {gl, WebGL2} from "./context";
import {Shader} from "./shader";
import {Drawable, Math} from "./types";
import {BlazeEvent} from "./blaze-event";

export class BlazeRenderer {
  private rendering = false;
  private readonly drawables: Drawable[] = [];
  private readonly canvas!: HTMLCanvasElement;
  private shader!: Shader;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    WebGL2.setContext(this.canvas);
    if (gl() === null || gl() === undefined) {
      throw new Error(`WebGl2 is not supported`);
    }
    this.setPresets();
    this.setLoop();
    this.setEventListeners();
  }
  start() {
    this.rendering = true;
  }
  stop() {
    this.rendering = false;
  }
  setShader(shader: Shader) {
    this.shader = shader;
    this.setCamera();
  }
  addDrawable(drawable: Drawable) {
    this.drawables.push(drawable);
  }
  private setCamera() {
    this.shader.bind();
    const model: Math.Mat4 = Math.Mat4Utils.identity();
    gl().uniformMatrix4fv(
      this.shader.getUniformLocation("u_model"),
      false,
      new Float32Array(Math.Mat4Utils.toColumnArray(model))
    );
    const view: Math.Mat4 = Math.Mat4Utils.identity();
    gl().uniformMatrix4fv(
      this.shader.getUniformLocation("u_view"),
      false,
      new Float32Array(Math.Mat4Utils.toColumnArray(view))
    );
  }
  private setPresets() {
    gl().clearColor(1, 1, 1, 1);
  }
  private setLoop() {
    setInterval(() => {
      // bind shaders
      this.shader.bind();
      // clear buffer
      gl().clear(gl().COLOR_BUFFER_BIT | gl().DEPTH_BUFFER_BIT);
      // render drawables
      if (!this.rendering)
        return;
      this.drawables.forEach((drawable) => drawable.draw());
    }, 1000 / 30);
  }
  private setEventListeners() {
    window.addEventListener(BlazeEvent.START, () => {
      console.info(`blaze: start`);
      this.rendering = true;
    });
    window.addEventListener(BlazeEvent.STOP, () => {
      console.info(`blaze: stop`);
      this.rendering = false;
    });
  }
}
