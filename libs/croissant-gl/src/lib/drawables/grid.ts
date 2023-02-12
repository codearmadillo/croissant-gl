import {DrawableObject} from "../graphics/drawable-object";
import {Vertex} from "../types/graphics";

export class Grid extends DrawableObject {
  constructor() {
    super();
    this.compile();
  }
  protected getVertices(): Vertex[] {
    const size = 15;
    return [
      new Vertex([ -size, 0, -size ], [ 1, 0, 0 ]),
      new Vertex([ size, 0, -size ], [ 0, 1, 0 ]),
      new Vertex([ size, 0, size ], [ 0, 0, 1 ]),
      new Vertex([ -size, 0, size ], [ 1, 0, 0 ])
    ];
  }
  protected getIndices(): number[] {
    return [
      0, 1, 2,
      0, 2, 3
    ];
  }
}
