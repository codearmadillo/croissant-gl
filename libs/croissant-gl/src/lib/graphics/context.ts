let webGlRenderingContext: WebGL2RenderingContext | null = null;

export namespace WebGL2 {
  export function setContextFromCanvas(canvas: HTMLCanvasElement) {
    webGlRenderingContext = canvas?.getContext("webgl2") as WebGL2RenderingContext;
  }
}

export const gl = () => {
  return webGlRenderingContext as WebGL2RenderingContext;
}
