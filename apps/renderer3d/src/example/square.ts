import {Drawable, Vertex} from "../renderer/types";
import {VertexArrayObject} from "../renderer/vertex-array-object";

export class Square implements Drawable {
  protected readonly vao: VertexArrayObject;
  constructor() {
    this.vao = new VertexArrayObject();
    this.vao.addVertices([
      new Vertex([  0.5, -0.5, 0 ], [ 1.0, 0.0, 0.0 ]),
      new Vertex([  0.5, 0.5, 0, ], [ 0.0, 1.0, 0.0 ]),
      new Vertex([ -0.5, 0.5, 0, ], [ 0.0, 0.0, 1.0 ]),
      new Vertex([ -0.5, -0.5, 0 ], [ 1.0, 0.0, 1.0 ])
    ]);
    this.vao.addIndices([
      0, 1, 2,
      0, 2, 3
    ]);
  }
  draw() {
    this.vao.draw();
  }
}
