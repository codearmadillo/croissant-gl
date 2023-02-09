export class WebGL2 {
  private static ctx: WebGL2RenderingContext;
  static setContext(canvas: HTMLCanvasElement) {
    this.ctx = canvas?.getContext("webgl2") as WebGL2RenderingContext;
  }
  static getContext() {
    return this.ctx;
  }
}
export const gl = () => {
  return WebGL2.getContext();
}
