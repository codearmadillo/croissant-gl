import {gl} from "./context";

export class IndexArray {
  private readonly buffer: WebGLBuffer | null;
  private readonly indices: Uint16Array;
  public readonly elements: number;
  constructor(indices: number[]) {
    this.indices = new Uint16Array(indices);
    this.elements = indices.length;
    this.buffer = gl().createBuffer();
    if (this.buffer === null) {
      throw new Error(`Tried creating IBO but createBuffer failed`);
    }
    this.attachData();
  }
  private attachData() {
    gl().bindBuffer(gl().ELEMENT_ARRAY_BUFFER, this.buffer);
    gl().bufferData(gl().ELEMENT_ARRAY_BUFFER, this.indices, gl().STATIC_DRAW);
  }
}
