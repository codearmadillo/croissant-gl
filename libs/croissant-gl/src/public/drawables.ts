import {Vertex} from "../lib/types/graphics";
import * as glMatrix from "gl-matrix";
import {DrawableObject} from "../lib/graphics/drawable-object";

export class Rect extends DrawableObject {
  private readonly size: glMatrix.vec2;
  constructor(size: glMatrix.vec2) {
    super();
    this.size = size;
    this.compile();
  }
  protected getVertices(): Vertex[] {
    return [
      /*
      new Vertex([  0.5, -0.5, 0 ], [ 1.0, 0.0, 0.0 ]),
      new Vertex([  0.5, 0.5, 0, ], [ 0.0, 1.0, 0.0 ]),
      new Vertex([ -0.5, 0.5, 0, ], [ 0.0, 0.0, 1.0 ]),
      new Vertex([ -0.5, -0.5, 0 ], [ 1.0, 0.0, 1.0 ])
       */
      new Vertex([ -50, 0, -50 ], [ 1.0, 0.0, 0.0 ]),
      new Vertex([ 50, 0, -50 ], [ 0.0, 1.0, 0.0 ]),
      new Vertex([ 50, 0, 50 ], [ 0.0, 0.0, 1.0 ]),
      new Vertex([ -50, 0, 50 ], [ 1.0, 0.0, 1.0 ])
    ];
  }
  protected getIndices(): number[] {
    return [
      0, 1, 2,
      0, 2, 3
    ];
  }
}
