import {VertexArrayObject} from "./graphics/vertex-array-object";
import {DrawableType} from "./graphics/drawable-type";
import {getCubeVerticesIndices, getPlaneVerticesIndices} from "./graphics/drawables";
import {Vertex} from "./types/graphics";
import {MAX_OBJECTS, RENDERER_UPDATE_RATE} from "./constants";
import {gl} from "./graphics/context";
import {defaultShader} from "./graphics/shader";
import {defaultCamera} from "./graphics/camera";
import {objectBroker} from "./object-broker";
import {objectPropertiesBroker} from "./object-properties-broker";
import {vec2, vec3} from "gl-matrix";

class Renderer {
    private dirty = true;
    private _passes = 0;
    private vao: (VertexArrayObject | null)[] = [];
    private planes: VertexArrayObject[] = [];
    private visiblePlanes: boolean[] = [false, false, false];

    public get passes() {
        return this._passes;
    }

    constructor() {
        for (let i = 0; i < MAX_OBJECTS; i++) {
            this.vao[i] = null;
        }
    }
    create(entity: number, type: DrawableType) {
        const vao = new VertexArrayObject();
        const [ vertices, indices ] = this.getVerticesIndices(type);
        vao.addIndices(indices);
        vao.addVertices(vertices);
        this.vao[entity] = vao;
    }
    clear(entity: number) {
        this.vao[entity] = null;
    }
    bootstrap() {
        gl().enable(gl().DEPTH_TEST);
        gl().clearColor(1, 1, 1, 1);
        this.setupPlanes();
    }
    loop() {
        setInterval(() => {
            this.renderFrame();
        }, 1000 / RENDERER_UPDATE_RATE);
    }

    enableAxes(xz: boolean, xy: boolean, yz: boolean) {
        this.visiblePlanes[0] = xz;
        this.visiblePlanes[1] = xy;
        this.visiblePlanes[2] = yz;
        this.dirty = true;
    }
    private renderFrame() {
        // only render frame if camera or any objects are dirty
        if (!objectPropertiesBroker.isDirty() && !defaultCamera.isDirty() && !this.dirty) {
            return;
        }
        this.dirty = false;
        this._passes++;
        // clear buffer
        gl().clear(gl().COLOR_BUFFER_BIT | gl().DEPTH_BUFFER_BIT);
        // bind shader
        defaultShader.bind();
        // bind camera
        defaultCamera.bind();
        // iterate through objects
        objectBroker.each((entity: number) => {
            if (!objectPropertiesBroker.getEnabled(entity)) {
                return;
            }
            // bind model and other properties
            objectPropertiesBroker.bind(entity);
            // bind vao
            this.vao[entity]?.bind();
            // draw
            this.vao[entity]?.drawElements();
            // unbind vao
            gl().bindVertexArray(null);
        });
        // unbind uniforms
        objectPropertiesBroker.unbind();
        // render grid
        this.planes.forEach((plane, i) => {
            if (this.visiblePlanes[i]) {
                plane.drawLines();
            }
        });
    }
    private getVerticesIndices(type: DrawableType): [ Vertex[], number[] ] {
        switch(type.type) {
            case "cube":
                return getCubeVerticesIndices(type.size, type.position);
            case "plane":
                return getPlaneVerticesIndices(type.size, type.position);
        }
    }
    private setupPlanes() {

        const cols = 12;
        const rows = 12;
        const size = 200;
        const offset = size / 2;

        // generate xz axis
        const xzAxisVao = new VertexArrayObject();
        const xzAxisVertices: Vertex[] = [];
        const xzAxisIndices: number[] = [];

        for (let z = 0; z < rows + 1; z++) {
            xzAxisVertices.push(
                new Vertex([ -offset, 0, z * (size / rows) - offset ], [ 1, 0, 0 ]),
                new Vertex([ size - offset, 0, z * (size / rows) - offset ], [ 1, 0, 0 ])
            );
            const indexOffset = xzAxisIndices.length;
            xzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        for (let x = 0; x < cols + 1; x++) {
            xzAxisVertices.push(
                new Vertex([ x * (size / rows) - offset, 0, -offset ], [ 1, 0, 0 ]),
                new Vertex([ x * (size / rows) - offset, 0, size - offset ], [ 1, 0, 0 ])
            );
            const indexOffset = xzAxisIndices.length;
            xzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        xzAxisVao.addVertices(xzAxisVertices);
        xzAxisVao.addIndices(xzAxisIndices);
        this.planes.push(xzAxisVao);

        // generate xy axis
        const xyAxisVao = new VertexArrayObject();
        const xyAxisVertices: Vertex[] = [];
        const xyAxisIndices: number[] = [];

        for (let y = 0; y < rows + 1; y++) {
            xyAxisVertices.push(
                new Vertex([ -offset, y * (size / rows) - offset, 0 ], [ 0, 1, 0 ]),
                new Vertex([ size - offset, y * (size / rows) - offset, 0 ], [ 0, 1, 0 ])
            );
            const indexOffset = xyAxisIndices.length;
            xyAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        for (let x = 0; x < cols + 1; x++) {
            xyAxisVertices.push(
                new Vertex([ x * (size / rows) - offset, -offset, 0 ], [ 0, 1, 0 ]),
                new Vertex([ x * (size / rows) - offset, size - offset, 0 ], [ 0, 1, 0 ])
            );
            const indexOffset = xyAxisIndices.length;
            xyAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        xyAxisVao.addVertices(xyAxisVertices);
        xyAxisVao.addIndices(xyAxisIndices);
        this.planes.push(xyAxisVao);

        // generate yz axis
        const yzAxisVao = new VertexArrayObject();
        const yzAxisVertices: Vertex[] = [];
        const yzAxisIndices: number[] = [];

        for (let y = 0; y < rows + 1; y++) {
            yzAxisVertices.push(
                new Vertex([ 0, -offset, y * (size / rows) - offset ], [ 0, 0, 1 ]),
                new Vertex([ 0, size - offset, y * (size / rows) - offset ], [ 0, 0, 1 ])
            );
            const indexOffset = yzAxisIndices.length;
            yzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        for (let z = 0; z < cols + 1; z++) {
            yzAxisVertices.push(
                new Vertex([ 0, z * (size / rows) - offset, -offset ], [ 0, 0, 1 ]),
                new Vertex([ 0, z * (size / rows) - offset, size - offset ], [ 0, 0, 1 ])
            );
            const indexOffset = yzAxisIndices.length;
            yzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        yzAxisVao.addVertices(yzAxisVertices);
        yzAxisVao.addIndices(yzAxisIndices);
        this.planes.push(yzAxisVao);

        /*

        // generate y axis

        const yAxisVertices: Vertex[] = [
            new Vertex([ -size / 2, -size / 2, 0 ], [ 0, 1, 0 ]),
            new Vertex([ size / 2, -size / 2, 0 ], [ 0, 1, 0 ]),
            new Vertex([ size / 2, size / 2, 0 ], [ 0, 1, 0 ]),
            new Vertex([ -size / 2, size / 2, 0 ], [ 0, 1, 0 ]),
        ];

        const yAxisVertices: Vertex[] = [];
        const yAxisIndices: number[] = [];
        const yAxisVao = new VertexArrayObject();

        for (let y = 0; y < rows + 1; y++) {

            xAxisVertices.push(
                new Vertex([ -offset, 0, y * (size / rows) - offset ], [ 1, 0, 0 ]),
                new Vertex([ size - offset, 0, y * (size / rows) - offset ], [ 1, 0, 0 ])
            );
            const indexOffset = xAxisIndices.length;
            xAxisIndices.push(indexOffset, 1 + indexOffset);

        }
        for (let x = 0; x < cols + 1; x++) {

            xAxisVertices.push(
                new Vertex([ x * (size / rows) - offset, 0, -offset ], [ 1, 0, 0 ]),
                new Vertex([ x * (size / rows) - offset, 0, size - offset ], [ 1, 0, 0 ])
            );
            const indexOffset = xAxisIndices.length;
            xAxisIndices.push(indexOffset, 1 + indexOffset);

        }

        yAxisVao.addVertices(yAxisVertices);
        yAxisVao.addIndices(yAxisIndices);
        this.planes.push(yAxisVao);

        // generate z axis
        const zAxisVertices: Vertex[] = [
            new Vertex([ 0, -size / 2, -size / 2 ], [ 0, 0, 1 ]),
            new Vertex([ 0, -size / 2, size / 2 ], [ 0, 0, 1 ]),
            new Vertex([ 0, size / 2, size / 2 ], [ 0, 0, 1 ]),
            new Vertex([ 0, size / 2, -size / 2], [ 0, 0, 1 ]),
        ];
        const zAxisVao = new VertexArrayObject();
        zAxisVao.addVertices(zAxisVertices);
        zAxisVao.addIndices(indices);
        this.planes.push(zAxisVao);

      // should be even
      const cols = 6;
      const rows = 6;

      // generate two dimensional points
      const points: vec2[] = [];
      for (let y = -rows / 2; y < rows / 2 + 1; y++) {
        for (let x = -cols / 2; x < cols / 2 + 1; x++) {
          points.push([x, y]);
        }
      }

      // transform points to actual vertices
      const vertices: vec3[] = [];
      const tileSize = 12;

      for (let i = 0; i < points.length; i++) {
        vertices.push(
          [ points[i][0] * tileSize, 0, points[i][1] * tileSize ]
        );
      }

      // define indices
      const indices: vec2[] = [];

      // generate indices for columns
      for (let x = 0; x < cols + 1; x++) {
        indices.push([ x, 7 * rows + x ]);
      }

      // generate indices for rows
      for (let z = 0; z < rows + 1; z++) {
        indices.push([ z * 7, z * 7 + cols ]);
      }

      // transform vertex positions into actual vertices
      const vertexArray = vertices.map((vert) => {
        return new Vertex(vert, [ 0.55, 0.55, 0.55 ]);
      });

      // transform index positions into flat index array
      const indexArray: number[] = [];
      indices.forEach((indexPair) => indexArray.push(indexPair[0], indexPair[1]));

      // generate vao and add vertices/indices to it
      const vao = new VertexArrayObject();
      vao.addVertices(vertexArray);
      vao.addIndices(indexArray);

      // store the vao
      this.gridVao = vao;
         */
    }
}
export const renderer = new Renderer();
