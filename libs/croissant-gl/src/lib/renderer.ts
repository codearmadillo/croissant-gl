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
import {vec2, vec3, vec4} from "gl-matrix";
import {defaultLight} from "./graphics/light";

class Renderer {

    private dirty = true;
    private vao: (VertexArrayObject | null)[] = [];
    private planes: VertexArrayObject[] = [];
    private visiblePlanes: boolean[] = [false, false, false];
    public passes = 0;

    constructor() {
        for (let i = 0; i < MAX_OBJECTS; i++) {
            this.vao[i] = null;
        }
    }
    entityCreated(entity: number, type: DrawableType) {
        const vao = new VertexArrayObject();
        const [ vertices, indices ] = this.getVerticesIndices(type);
        vao.addIndices(indices);
        vao.addVertices(vertices);
        this.vao[entity] = vao;
    }
    entityDestroyed(entity: number) {
        this.vao[entity] = null;
    }
    async bootstrap() {
        gl().enable(gl().DEPTH_TEST);
        gl().clearColor(1, 1, 1, 1);
        gl().lineWidth(1);
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

    setClearColor(rgb: vec3) {
      gl().clearColor(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1.0);
    }

    private renderFrame() {
        // only render frame if camera or any objects are dirty
        if (!objectPropertiesBroker.isDirty() && !defaultCamera.isDirty() && !defaultLight.isDirty() && !this.dirty) {
            return;
        }
        this.dirty = false;
        this.passes++;
        // clear buffer
        gl().clear(gl().COLOR_BUFFER_BIT | gl().DEPTH_BUFFER_BIT);
        // bind shader
        defaultShader.bind();
        // bind camera
        defaultCamera.bind();
        // bind light source
        defaultLight.bind();
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
                return getCubeVerticesIndices(type.size, type.position, type.color);
            case "plane":
                return getPlaneVerticesIndices(type.size, type.position, type.color);
        }
    }
    private setupPlanes() {
        const transparency = 0.25;
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
                new Vertex([ -offset, 0, z * (size / rows) - offset ], [ 1, 1, 1 ] ,[ 1, 0, 0, transparency ]),
                new Vertex([ size - offset, 0, z * (size / rows) - offset ], [ 1, 1, 1 ], [ 1, 0, 0, transparency ])
            );
            const indexOffset = xzAxisIndices.length;
            xzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        for (let x = 0; x < cols + 1; x++) {
            xzAxisVertices.push(
                new Vertex([ x * (size / rows) - offset, 0, -offset ], [ 1, 1, 1 ] ,[ 1, 0, 0, transparency ]),
                new Vertex([ x * (size / rows) - offset, 0, size - offset ], [ 1, 1, 1 ], [ 1, 0, 0, transparency ])
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
                new Vertex([ -offset, y * (size / rows) - offset, 0 ], [ 1, 1, 1 ] ,[ 0, 1, 0, transparency ]),
                new Vertex([ size - offset, y * (size / rows) - offset, 0 ], [ 1, 1, 1 ], [ 0, 1, 0, transparency ])
            );
            const indexOffset = xyAxisIndices.length;
            xyAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        for (let x = 0; x < cols + 1; x++) {
            xyAxisVertices.push(
                new Vertex([ x * (size / rows) - offset, -offset, 0 ], [ 1, 1, 1 ] ,[ 0, 1, 0, transparency ]),
                new Vertex([ x * (size / rows) - offset, size - offset, 0 ], [ 1, 1, 1 ], [ 0, 1, 0, transparency ])
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
                new Vertex([ 0, -offset, y * (size / rows) - offset ], [ 1, 1, 1 ], [ 0, 0, 1, transparency ]),
                new Vertex([ 0, size - offset, y * (size / rows) - offset ], [ 1, 1, 1 ], [ 0, 0, 1, transparency ])
            );
            const indexOffset = yzAxisIndices.length;
            yzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        for (let z = 0; z < cols + 1; z++) {
            yzAxisVertices.push(
                new Vertex([ 0, z * (size / rows) - offset, -offset ], [ 1, 1, 1 ], [ 0, 0, 1, transparency ]),
                new Vertex([ 0, z * (size / rows) - offset, size - offset ], [ 1, 1, 1 ], [ 0, 0, 1, transparency ])
            );
            const indexOffset = yzAxisIndices.length;
            yzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        yzAxisVao.addVertices(yzAxisVertices);
        yzAxisVao.addIndices(yzAxisIndices);
        this.planes.push(yzAxisVao);
    }
}
export const renderer = new Renderer();
