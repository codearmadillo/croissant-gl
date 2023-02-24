import {VertexArrayObject} from "./graphics/vertex-array-object";
import {getCubeVerticesIndices, getPlaneVerticesIndices} from "./graphics/drawables";
import {ShaderType, Vertex} from "./types/graphics";
import {MAX_OBJECTS, RENDERER_UPDATE_RATE} from "./constants";
import {glMatrix, mat4, vec3} from "gl-matrix";
import {Light} from "./graphics/light";
import {Camera, CameraInfo} from "./types/camera";
import {Axis, RendererStatistics} from "./types/renderer";
import {EntityMaterial} from "./types/entity";
import {Texture} from "./types/texture";
import {isNullOrUndefined} from "./helpers/type.helpers";
import {ObjectBroker} from "./brokers/object-broker";
import {ObjectPropertiesBroker} from "./brokers/object-properties-broker";
import {ShaderBroker} from "./brokers/shader-broker";
import {TextureBroker} from "./brokers/texture-broker";
import {ObjectCreateOptions} from "./types/drawables";

export class Renderer {

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
    private projection: mat4;
    private view: mat4;
    private readonly webGl2RenderingContext: WebGL2RenderingContext;

    private readonly objectBroker: ObjectBroker;
    private readonly objectPropertiesBroker: ObjectPropertiesBroker;
    private readonly shaderBroker: ShaderBroker;
    private readonly textureBroker: TextureBroker;

    public light: Light;

    private interval: any;
    private dirty = true;
    public stats: RendererStatistics = {
        passes: 0,
        totalRenderTimeInMs: 0
    }

    constructor(webGl2RenderingContext: WebGL2RenderingContext, objectBroker: ObjectBroker, objectPropertiesBroker: ObjectPropertiesBroker, shaderBroker: ShaderBroker, textureBroker: TextureBroker) {
      this.webGl2RenderingContext = webGl2RenderingContext;
      this.objectBroker = objectBroker;
      this.objectPropertiesBroker = objectPropertiesBroker;
      this.shaderBroker = shaderBroker;
      this.textureBroker = textureBroker;

      for (let i = 0; i < MAX_OBJECTS; i++) {
          this.entityVao[i] = null;
          this.entityModelMatrix[i] = null;
      }
    }

    //#region Entities
    entityCreated(entity: number, options: ObjectCreateOptions) {
        const vao = new VertexArrayObject(this.webGl2RenderingContext);
        const [ vertices, indices ] = this.getVerticesIndices(options);
        vao.addIndices(indices);
        vao.addVertices(vertices);

        this.entityVao[entity] = vao;
        this.entityModelMatrix[entity] = mat4.create();
    }
    entityDestroyed(entity: number) {
        this.entityVao[entity]!.destroy();
        this.entityVao[entity] = null;
        this.entityModelMatrix[entity] = null;
    }
    //#endregion

    //#region Lifecycle
    bootstrap() {
        this.webGl2RenderingContext.enable(this.webGl2RenderingContext.DEPTH_TEST);
        this.webGl2RenderingContext.clearColor(1, 1, 1, 1);
        this.webGl2RenderingContext.lineWidth(1);

        this.light = new Light();

        this.generateAxisObjects();
    }

    loop() {
        this.interval = setInterval(() => {
            this.renderFrame();
        }, 1000 / RENDERER_UPDATE_RATE);
    }
    breakLoop() {
        clearInterval(this.interval);
    }
    finalize() {
      // Clear objects
      for (let i = 0; i < MAX_OBJECTS; i++) {
        if (this.objectBroker.exists(i)) {
          this.entityDestroyed(i);
        }
      }
      // Clear axis VAOs
      this.axis.forEach((axis) => {
          axis.vao.destroy();
      });
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
      this.webGl2RenderingContext.clearColor(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1.0);
    }

    private getCalculatedProjectionMatrix() {
        return mat4.perspective(mat4.create(), glMatrix.toRadian(this.camera.fov), this.webGl2RenderingContext.canvas.width / this.webGl2RenderingContext.canvas.height, this.camera.near, this.camera.far);
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
        if (!this.objectPropertiesBroker.isDirty() && !this.textureBroker.isDirty() && !this.light.isDirty() && !this.dirty) {
            return;
        }
        const startTimeMs = new Date().getTime();

        this.webGl2RenderingContext.clear(this.webGl2RenderingContext.COLOR_BUFFER_BIT | this.webGl2RenderingContext.DEPTH_BUFFER_BIT);
        this.webGl2RenderingContext.viewport(0, 0, this.webGl2RenderingContext.canvas.width, this.webGl2RenderingContext.canvas.height);

        // Calculate projection/view for render pass
        this.projection = this.getCalculatedProjectionMatrix();
        this.view = this.getCalculatedViewMatrix();

        // Iterate through objects
        this.objectBroker.each((entity: number) => {
            if (!this.objectPropertiesBroker.isEntityEnabled(entity)) {
                return;
            }

            // Recalculate model if entity is dirty
            if (this.objectPropertiesBroker.isEntityDirty(entity)) {
                mat4.fromRotationTranslationScale(this.entityModelMatrix[entity] as mat4, this.objectPropertiesBroker.getRotationQuaternion(entity), this.objectPropertiesBroker.getTranslation(entity) as vec3, this.objectPropertiesBroker.getScale(entity) as vec3);
            }

            // Bind shader
            const material = this.objectPropertiesBroker.getMaterial(entity) as EntityMaterial;
            const shader = this.shaderBroker.get(material.shader);
            shader.bind();

            // Bind material
            const color = [ material.color[0] / 255, material.color[1] / 255, material.color[2] / 255 ];
            this.webGl2RenderingContext.uniform3fv(shader.getUniformLocation("u_vertexColor"), color);

            // Disable texture by default
            this.webGl2RenderingContext.uniform1i(shader.getUniformLocation("u_materialTextureUsed"), 0);

            // Bind texture if any
            if (isNullOrUndefined(material.texture)) {
              // Bind albedo (doesn't always mean it is albedo texture though...)
              const glTexture = this.textureBroker.get(material.texture as Texture) as WebGLTexture;
              if (glTexture !== null) {
                this.webGl2RenderingContext.uniform1i(shader.getUniformLocation("u_materialTextureUsed"), 1);
                this.webGl2RenderingContext.uniform1i(shader.getUniformLocation("u_materialTexture"), glTexture as GLint);
                this.webGl2RenderingContext.activeTexture(this.webGl2RenderingContext.TEXTURE0);
                this.webGl2RenderingContext.bindTexture(this.webGl2RenderingContext.TEXTURE_2D, glTexture);
              }
            }

            // Bind light
            this.webGl2RenderingContext.uniform3fv(shader.getUniformLocation("u_lightPosition"), this.light.getPosition());
            this.webGl2RenderingContext.uniform3fv(shader.getUniformLocation("u_lightColor"), this.light.getColor());

            // Bind MVP matrices
            this.webGl2RenderingContext.uniformMatrix4fv(shader.getUniformLocation("u_projection"), false, this.projection);
            this.webGl2RenderingContext.uniformMatrix4fv(shader.getUniformLocation("u_view"), false, this.view);
            this.webGl2RenderingContext.uniformMatrix4fv(shader.getUniformLocation("u_model"), false, this.entityModelMatrix[entity] as mat4);

            // Bind VAO and perform draw call
            this.entityVao[entity]?.bind();
            this.entityVao[entity]?.drawElements();
            this.webGl2RenderingContext.bindVertexArray(null);

            // Cleanup
            if (material.texture !== null) {
              this.webGl2RenderingContext.activeTexture(this.webGl2RenderingContext.TEXTURE0);
              this.webGl2RenderingContext.bindTexture(this.webGl2RenderingContext.TEXTURE_2D, null);
            }

            // Entity was re-rendered - mark it as pristine
            this.objectPropertiesBroker.entityRendered(entity);
        });
        // render grid
        this.renderAxis();
        // mark renderer as pristine
        this.markAsPristine();
        // statistics
        this.stats.passes++;
        this.stats.totalRenderTimeInMs = new Date().getTime() - startTimeMs;
    }
    private renderAxis() {
      const uiShader = this.shaderBroker.get(ShaderType.UI_SHADER);
      uiShader.bind();

      this.webGl2RenderingContext.uniformMatrix4fv(uiShader.getUniformLocation("u_projection"), false, this.projection);
      this.webGl2RenderingContext.uniformMatrix4fv(uiShader.getUniformLocation("u_view"), false, this.view);
      this.webGl2RenderingContext.uniformMatrix4fv(uiShader.getUniformLocation("u_model"), false, mat4.create());

      this.axis.forEach((axis) => {
        if (!axis.enabled) {
          return;
        }
        this.webGl2RenderingContext.uniform3fv(uiShader.getUniformLocation("u_vertexColor"), axis.color);
        axis.vao.drawLines();
      });
    }
    private getVerticesIndices(options: ObjectCreateOptions): [ Vertex[], number[] ] {
        switch(options.type) {
            case "cube":
                return getCubeVerticesIndices(options.size, options.position);
            case "plane":
                return getPlaneVerticesIndices(options.size, options.position);
        }
    }
    private generateAxisObjects() {
        const cols = 12;
        const rows = 12;
        const size = 200;
        const offset = size / 2;

        // generate xz axis
        const xzAxisVao = new VertexArrayObject(this.webGl2RenderingContext);
        const xzAxisVertices: Vertex[] = [];
        const xzAxisIndices: number[] = [];

        for (let z = 0; z < rows + 1; z++) {
            xzAxisVertices.push(
                new Vertex([ -offset, 0, z * (size / rows) - offset ], [ 1, 1, 1 ], [ 0, 0 ]),
                new Vertex([ size - offset, 0, z * (size / rows) - offset ], [ 1, 1, 1 ], [ 0, 0 ])
            );
            const indexOffset = xzAxisIndices.length;
            xzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        for (let x = 0; x < cols + 1; x++) {
            xzAxisVertices.push(
                new Vertex([ x * (size / rows) - offset, 0, -offset ], [ 1, 1, 1 ], [ 0, 0 ]),
                new Vertex([ x * (size / rows) - offset, 0, size - offset ], [ 1, 1, 1 ], [ 0, 0 ])
            );
            const indexOffset = xzAxisIndices.length;
            xzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        xzAxisVao.addVertices(xzAxisVertices);
        xzAxisVao.addIndices(xzAxisIndices);
        this.axis.push({
            orientation: [ 1, 0, 1 ],
            enabled: true,
            vao: xzAxisVao,
            color: [ 1, 0, 0 ]
        });

        // generate xy axis
        const xyAxisVao = new VertexArrayObject(this.webGl2RenderingContext);
        const xyAxisVertices: Vertex[] = [];
        const xyAxisIndices: number[] = [];

        for (let y = 0; y < rows + 1; y++) {
            xyAxisVertices.push(
                new Vertex([ -offset, y * (size / rows) - offset, 0 ], [ 1, 1, 1 ], [ 0, 0 ]),
                new Vertex([ size - offset, y * (size / rows) - offset, 0 ], [ 1, 1, 1 ], [ 0, 0 ])
            );
            const indexOffset = xyAxisIndices.length;
            xyAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        for (let x = 0; x < cols + 1; x++) {
            xyAxisVertices.push(
                new Vertex([ x * (size / rows) - offset, -offset, 0 ], [ 1, 1, 1 ], [ 0, 0 ]),
                new Vertex([ x * (size / rows) - offset, size - offset, 0 ], [ 1, 1, 1 ], [ 0, 0 ])
            );
            const indexOffset = xyAxisIndices.length;
            xyAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        xyAxisVao.addVertices(xyAxisVertices);
        xyAxisVao.addIndices(xyAxisIndices);
        this.axis.push({
            orientation: [ 1, 1, 0 ],
            enabled: true,
            vao: xyAxisVao,
            color: [ 0, 1, 0 ]
        });

        // generate yz axis
        const yzAxisVao = new VertexArrayObject(this.webGl2RenderingContext);
        const yzAxisVertices: Vertex[] = [];
        const yzAxisIndices: number[] = [];

        for (let y = 0; y < rows + 1; y++) {
            yzAxisVertices.push(
                new Vertex([ 0, -offset, y * (size / rows) - offset ], [ 1, 1, 1 ], [ 0, 0 ]),
                new Vertex([ 0, size - offset, y * (size / rows) - offset ], [ 1, 1, 1 ], [ 0, 0 ])
            );
            const indexOffset = yzAxisIndices.length;
            yzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        for (let z = 0; z < cols + 1; z++) {
            yzAxisVertices.push(
                new Vertex([ 0, z * (size / rows) - offset, -offset ], [ 1, 1, 1 ], [ 0, 0 ]),
                new Vertex([ 0, z * (size / rows) - offset, size - offset ], [ 1, 1, 1 ], [ 0, 0 ])
            );
            const indexOffset = yzAxisIndices.length;
            yzAxisIndices.push(indexOffset, 1 + indexOffset);
        }
        yzAxisVao.addVertices(yzAxisVertices);
        yzAxisVao.addIndices(yzAxisIndices);
        this.axis.push({
            orientation: [ 0, 1, 1 ],
            enabled: true,
            vao: yzAxisVao,
            color: [ 0, 0, 1 ]
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
        this.textureBroker.markAsPristine();
        this.light.markAsPristine();
    }
}
