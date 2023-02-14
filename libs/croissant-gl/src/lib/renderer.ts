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

    private _passes = 0;
    private vao: (VertexArrayObject | null)[] = [];
    private gridVao: VertexArrayObject;

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
        this.setupGrid();
    }
    loop() {
        setInterval(() => {
            this.renderFrame();
        }, 1000 / RENDERER_UPDATE_RATE);
    }
    private renderFrame() {
        // only render frame if camera or any objects are dirty
        if (!objectPropertiesBroker.isDirty() && !defaultCamera.isDirty()) {
            return;
        }
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
        this.gridVao.drawLines();
    }
    private getVerticesIndices(type: DrawableType): [ Vertex[], number[] ] {
        switch(type.type) {
            case "cube":
                return getCubeVerticesIndices(type.size, type.position);
            case "plane":
                return getPlaneVerticesIndices(type.size, type.position);
        }
    }
    private setupGrid() {
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
    }
}
export const renderer = new Renderer();
