export class IndexArray {
  private readonly buffer: WebGLBuffer | null;
  private readonly indices: Uint16Array;
  private readonly webGl2RenderingContext: WebGL2RenderingContext;
  public readonly elements: number;
  constructor(indices: number[], webGl2RenderingContext: WebGL2RenderingContext) {
    this.webGl2RenderingContext = webGl2RenderingContext;
    this.indices = new Uint16Array(indices);
    this.elements = indices.length;
    this.buffer = webGl2RenderingContext.createBuffer();
    if (this.buffer === null) {
      throw new Error(`Tried creating IBO but createBuffer failed`);
    }
    this.attachData();
  }
  private attachData() {
    this.webGl2RenderingContext.bindBuffer(this.webGl2RenderingContext.ELEMENT_ARRAY_BUFFER, this.buffer);
    this.webGl2RenderingContext.bufferData(this.webGl2RenderingContext.ELEMENT_ARRAY_BUFFER, this.indices, this.webGl2RenderingContext.STATIC_DRAW);
  }
}
