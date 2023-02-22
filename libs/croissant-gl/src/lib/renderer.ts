import {VertexArrayObject} from "./graphics/vertex-array-object";
import {DrawableType} from "./graphics/drawable-type";
import {getCubeVerticesIndices, getPlaneVerticesIndices} from "./graphics/drawables";
import {Vertex} from "./types/graphics";
import {MAX_OBJECTS, RENDERER_UPDATE_RATE} from "./constants";
import {gl} from "./graphics/context";
import {objectBroker} from "./object-broker";
import {objectPropertiesBroker} from "./object-properties-broker";
import {mat4, vec3, glMatrix} from "gl-matrix";
import {defaultLight} from "./graphics/light";
import {Camera, CameraInfo} from "./types/camera";
import {Axis, RendererStatistics} from "./types/renderer";
import {shaderBroker} from "./shader-broker";
import {EntityMaterial} from "./types/entity";

class Renderer {

    private camera: Camera = {
        focusPoint: [ 0, 0, 0 ],
        distance: 100,
        height: 50,
        orbit: 0,
        near: 0.1,
        far: 500,
        fov: 45,
        dirty: true,
    }
    private entityModelMatrix: (mat4 | null)[] = [];
    private entityVao: (VertexArrayObject | null)[] = [];
    private axis: Axis[] = [];

    private dirty = true;
    public stats: RendererStatistics = {
        passes: 0,
        totalRenderTimeInMs: 0
    }

    constructor() {
        for (let i = 0; i < MAX_OBJECTS; i++) {
            this.entityVao[i] = null;
            this.entityModelMatrix[i] = null;
        }
    }

    //#region Entities
    entityCreated(entity: number, type: DrawableType) {
        const vao = new VertexArrayObject();
        const [ vertices, indices ] = this.getVerticesIndices(type);
        vao.addIndices(indices);
        vao.addVertices(vertices);

        this.entityVao[entity] = vao;
        this.entityModelMatrix[entity] = mat4.create();
    }
    entityDestroyed(entity: number) {
        this.entityVao[entity] = null;
        this.entityModelMatrix[entity] = null;
    }
    //#endregion

    //#region Lifecycle
    async bootstrap() {
        gl().enable(gl().DEPTH_TEST);
        gl().clearColor(1, 1, 1, 1);
        gl().lineWidth(1);

        this.generateAxisObjects();
    }

    loop() {
        setInterval(() => {
            this.renderFrame();
        }, 1000 / RENDERER_UPDATE_RATE);
    }
    //#endregion

    enableAxes(xz: boolean, xy: boolean, yz: boolean) {
        this.axis = this.axis.map((axis) => {
            if (vec3.equals(axis.orientation, [ 1, 0, 1 ])) {
                axis.enabled = xz;
            }
            if (vec3.equals(axis.orientation, [ 1, 1, 0 ])) {
                axis.enabled = xy;
            }
            if (vec3.equals(axis.orientation, [ 0, 1, 1 ])) {
                axis.enabled = yz;
            }
            return axis;
        });
        this.markAsDirty();
    }

    setClearColor(rgb: vec3) {
      gl().clearColor(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1.0);
    }

    private getCalculatedProjectionMatrix() {
        return mat4.perspective(mat4.create(), glMatrix.toRadian(this.camera.fov), gl().canvas.width / gl().canvas.height, this.camera.near, this.camera.far);
    }

    private getCalculatedViewMatrix() {
        const up: vec3 = [ 0, 1, 0 ];
        const [ cameraX, cameraZ ] = [ Math.cos(glMatrix.toRadian(this.camera.orbit)), Math.sin(glMatrix.toRadian(this.camera.orbit)) ];
        const cameraPosition: vec3 = [ cameraX * this.camera.distance, this.camera.height, cameraZ * this.camera.distance ];
        const cameraView = mat4.fromTranslation(mat4.create(), cameraPosition);
        return mat4.lookAt(cameraView, cameraPosition, this.camera.focusPoint, up);
    }

    private renderFrame() {
        // only render frame if camera or any objects are dirty
        if (!objectPropertiesBroker.isDirty() && !defaultLight.isDirty() && !this.dirty) {
            return;
        }
        const startTimeMs = new Date().getTime();

        gl().clear(gl().COLOR_BUFFER_BIT | gl().DEPTH_BUFFER_BIT);
        gl().viewport(0, 0, gl().canvas.width, gl().canvas.height);

        // Calculate projection/view for render pass
        const projection = this.getCalculatedProjectionMatrix();
        const view = this.getCalculatedViewMatrix();

        // Iterate through objects
        objectBroker.each((entity: number) => {
            if (!objectPropertiesBroker.isEntityEnabled(entity)) {
                return;
            }

            // Recalculate model if entity is dirty
            if (objectPropertiesBroker.isEntityDirty(entity)) {
                mat4.fromRotationTranslationScale(this.entityModelMatrix[entity] as mat4, objectPropertiesBroker.getRotationQuaternion(entity), objectPropertiesBroker.getTranslation(entity) as vec3, objectPropertiesBroker.getScale(entity) as vec3);
            }

            // Bind shader
            const material = objectPropertiesBroker.getMaterial(entity) as EntityMaterial;
            const shader = shaderBroker.get(material.shader);
            shader.bind();

            // Bind material
            const color = material.color;
            gl().uniform3fv(shader.getUniformLocation("u_vertexColor"), color);

            // TODO: Check if material has a texture to bind

            // Bind light
            defaultLight.bind(shader);

            // Bind MVP matrices
            gl().uniformMatrix4fv(shader.getUniformLocation("u_projection"), false, projection);
            gl().uniformMatrix4fv(shader.getUniformLocation("u_view"), false, view);
            gl().uniformMatrix4fv(shader.getUniformLocation("u_model"), false, this.entityModelMatrix[entity] as mat4);

            // Bind VAO and perform drawcall
            this.entityVao[entity]?.bind();
            this.entityVao[entity]?.drawElements();
            gl().bindVertexArray(null);

            // Entity was re-rendered - mark it as pristine
            objectPropertiesBroker.entityRendered(entity);
        });
        // render grid
        this.axis.forEach((axis) => {
           if (axis.enabled) {
               axis.vao.drawLines();
           }
        });
        // mark renderer as pristine
        this.markAsPristine();
        // statistics
        this.stats.passes++;
        this.stats.totalRenderTimeInMs = new Date().getTime() - startTimeMs;
    }
    private getVerticesIndices(type: DrawableType): [ Vertex[], number[] ] {
        switch(type.type) {
            case "cube":
                return getCubeVerticesIndices(type.size, type.position, type.color);
            case "plane":
                return getPlaneVerticesIndices(type.size, type.position, type.color);
        }
    }
    private generateAxisObjects() {
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
        this.axis.push({
            orientation: [ 1, 0, 1 ],
            enabled: true,
            vao: xzAxisVao
        });

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
        this.axis.push({
            orientation: [ 1, 1, 0 ],
            enabled: true,
            vao: xyAxisVao
        });

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
        this.axis.push({
            orientation: [ 0, 1, 1 ],
            enabled: true,
            vao: yzAxisVao
        });
    }

    //#region Camera
    setCameraHeight(height: number) {
        this.camera.height = height;
        this.markAsDirty();
    }
    setCameraDistance(distance: number) {
        this.camera.distance = distance;
        this.markAsDirty();
    }
    setCameraOrbitAngle(degrees: number) {
        this.camera.orbit = degrees;
        this.markAsDirty();
    }
    setCameraClipPlanes(near: number, far: number) {
        this.camera.near = near;
        this.camera.far = far;
        this.markAsDirty();
    }
    setCameraFieldOfView(degrees: number) {
        this.camera.fov = degrees;
        this.markAsDirty();
    }
    setCameraFocusPoint(position: vec3) {
        this.camera.focusPoint = position;
        this.markAsDirty();
    }
    translateCameraFocusPoint(translation: vec3) {
        this.camera.focusPoint = vec3.add(vec3.create(), this.camera.focusPoint, translation);
        this.markAsDirty();
    }
    getCameraInfo(): CameraInfo {
        return {
            distance: this.camera.distance,
            orbitAngle: this.camera.orbit,
            height: this.camera.height,
            clipFar: this.camera.far,
            clipNear: this.camera.near,
            fieldOfView: this.camera.fov,
            focalPoint: this.camera.focusPoint
        }
    }
    //#endregion

    private markAsDirty() {
        this.dirty = true;
    }
    private markAsPristine() {
        this.dirty = false;
    }
}
export const renderer = new Renderer();
