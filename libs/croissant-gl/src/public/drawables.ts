import {Vertex} from "../lib/types/graphics";
import * as glMatrix from "gl-matrix";
import {DrawableObject} from "../lib/graphics/drawable-object";

export abstract class Rect extends DrawableObject {
  private readonly size: glMatrix.vec2;
  constructor(size: glMatrix.vec2) {
    super();
    this.size = size;
    this.compile();
  }
  protected getVertices(): Vertex[] {
    return [
      new Vertex([ -this.size[0] / 2, 0, -this.size[1] / 2 ], [ 1.0, 0.0, 0.0 ]),
      new Vertex([ this.size[0] / 2, 0, -this.size[1] / 2 ], [ 0.0, 1.0, 0.0 ]),
      new Vertex([ this.size[0] / 2, 0, this.size[1] / 2 ], [ 0.0, 0.0, 1.0 ]),
      new Vertex([ -this.size[0] / 2, 0, this.size[1] / 2 ], [ 1.0, 0.0, 1.0 ])
    ];
  }
  protected getIndices(): number[] {
    return [
      0, 1, 2,
      0, 2, 3
    ];
  }
}


export abstract class Cube extends DrawableObject {
  private readonly size: glMatrix.vec3;
  constructor(size: glMatrix.vec3) {
    super();
    this.size = size;
    this.compile();
  }
  protected getVertices(): Vertex[] {
    return [
      new Vertex([ -this.size[0] / 2, -this.size[1] / 2,  -this.size[2] / 2 ], [ 1.0, 0.0, 0.0 ]),
      new Vertex([ this.size[0] / 2,  -this.size[1] / 2,  -this.size[2] / 2 ], [ 0.0, 1.0, 0.0 ]),
      new Vertex([ this.size[0] / 2,  -this.size[1] / 2,  this.size[2] / 2 ], [ 0.0, 0.0, 1.0 ]),
      new Vertex([ -this.size[0] / 2, -this.size[1] / 2,  this.size[2] / 2 ], [ 1.0, 0.0, 1.0 ]),
      new Vertex([ -this.size[0] / 2, this.size[1] / 2,   -this.size[2] / 2 ], [ 1.0, 0.0, 0.0 ]),
      new Vertex([ this.size[0] / 2,  this.size[1] / 2,   -this.size[2] / 2 ], [ 0.0, 1.0, 0.0 ]),
      new Vertex([ this.size[0] / 2,  this.size[1] / 2,   this.size[2] / 2 ], [ 0.0, 0.0, 1.0 ]),
      new Vertex([ -this.size[0] / 2, this.size[1] / 2,   this.size[2] / 2 ], [ 1.0, 0.0, 1.0 ])
    ];
  }
  protected getIndices(): number[] {
    return [
      0, 1, 2,
      0, 2, 3,

      4, 5, 6,
      4, 6, 7,

      0, 4, 5,
      0, 5, 1,

      0, 3, 4,
      3, 4, 7,

      1, 2, 6,
      1, 5, 6,

      2, 3, 6,
      3, 7, 6
    ];
  }
}
