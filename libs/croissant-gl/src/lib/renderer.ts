import {VertexArrayObject} from "./graphics/vertex-array-object";
import {DrawableType} from "./graphics/drawable-type";
import {getCubeVerticesIndices} from "./graphics/drawables";
import {Vertex} from "./types/graphics";
import {MAX_OBJECTS, RENDERER_UPDATE_RATE} from "./constants";
import {gl} from "./graphics/context";
import {defaultShader} from "./graphics/shader";
import {defaultCamera} from "./graphics/camera";
import {objectBroker} from "./object-broker";
import {objectPropertiesBroker} from "./object-properties-broker";

class Renderer {
    private _passes = 0;
    private dirty = true;
    private vao: (VertexArrayObject | null)[] = [];

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
            this.vao[entity]?.draw();
            // unbind vao
            gl().bindVertexArray(null);
        });
    }
    markAsDirty() {
        this.dirty = true;
    }
    private getVerticesIndices(type: DrawableType): [ Vertex[], number[] ] {
        switch(type.type) {
            case "cube":
                return getCubeVerticesIndices(type.size, type.position);
        }
    }
}
export const renderer = new Renderer();