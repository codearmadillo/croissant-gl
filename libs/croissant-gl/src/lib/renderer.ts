import {VertexArrayObject} from "./graphics/vertex-array-object";
import {getCubeVerticesIndices, getObjMeshVerticesIndices, getPlaneVerticesIndices} from "./graphics/drawables";
import {ShaderType, Vertex, VertexCreateOptions} from "./types/graphics";
import {MAX_OBJECTS, RENDERER_UPDATE_RATE} from "./constants";
import {glMatrix, mat4, vec3} from "gl-matrix";
import {Light} from "./graphics/light";
import {Camera, CameraInfo} from "./types/camera";
import {Axis, Gimbal, RendererStatistics} from "./types/renderer";
import {EntityMaterial} from "./types/entity";
import {Texture} from "./types/texture";
import {isNullOrUndefined} from "./helpers/type.helpers";
import {ObjectBroker} from "./brokers/object-broker";
import {ObjectPropertiesBroker} from "./brokers/object-properties-broker";
import {ShaderBroker} from "./brokers/shader-broker";
import {TextureBroker} from "./brokers/texture-broker";
import {ObjectCreateOptions} from "./types/drawables";
import {VertexGroup} from "./graphics/vertex-group";
import {VertexGroupsFactory} from "./factories/vertex-groups.factory";

export class Renderer {

    private camera: Camera = {
        focusPoint: [ 0, 0, 0 ],
        distance: 100,
        height: 50,
        orbit: 0,
        near: 0.1,
        far: 3000,
        fov: 45,
        dirty: true,
    }
    private entityModelMatrix: (mat4 | null)[] = [];
    private entityVertexGroups: (VertexGroup[] | null)[] = [];
    private grid: Axis;
    private gimbal: Gimbal;
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
          this.entityModelMatrix[i] = null;
          this.entityVertexGroups[i] = null;
      }
    }

    //#region Entities
    async entityCreated(entity: number, options: ObjectCreateOptions) {
        this.entityModelMatrix[entity] = mat4.create();
        this.entityVertexGroups[entity] = await VertexGroupsFactory.getVertexGroups(options, this.webGl2RenderingContext);
    }
    entityDestroyed(entity: number) {
        this.entityModelMatrix[entity] = null;
        this.entityVertexGroups[entity]?.forEach((group) => {
          group.vao.destroy();
        });
        this.entityVertexGroups[entity] = null;
    }
    //#endregion

    //#region Lifecycle
    bootstrap() {
        this.webGl2RenderingContext.clearColor(1, 1, 1, 1);
        this.webGl2RenderingContext.lineWidth(1);

        this.light = new Light();

        this.generateGrid();
        this.generateGimbal();
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

      // Clear grid
      this.grid.vao.destroy();
    }
    //#endregion

    setGridVisibility(isGridVisible: boolean) {
      this.grid.enabled = isGridVisible;
      this.markAsDirty();
    }

    setGridColor(rgb: vec3) {
      this.grid.color = rgb;
      this.markAsDirty();
    }

    setGimbalVisibility(isGimbalVisible: boolean) {
      this.gimbal.enabled = isGimbalVisible;
      this.markAsDirty();
    }

    setClearColor(rgb: vec3) {
      this.webGl2RenderingContext.clearColor(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1.0);
    }

    private getCalculatedProjectionMatrix() {
        return mat4.perspective(mat4.create(), glMatrix.toRadian(this.camera.fov), this.webGl2RenderingContext.canvas.width / this.webGl2RenderingContext.canvas.height, this.camera.near, this.camera.far);
    }

    private getCalculatedViewMatrix(distance: number, orbit: number, height: number, focus: vec3) {
        const up: vec3 = [ 0, 1, 0 ];
        const [ cameraX, cameraZ ] = [ Math.cos(glMatrix.toRadian(orbit)), Math.sin(glMatrix.toRadian(orbit)) ];
        const cameraPosition: vec3 = [ cameraX * distance, height, cameraZ * distance ];
        const cameraView = mat4.fromTranslation(mat4.create(), cameraPosition);
        return mat4.lookAt(cameraView, cameraPosition, focus, up);
    }

    private renderFrame() {
        if (!this.objectPropertiesBroker.isDirty() && !this.textureBroker.isDirty() && !this.light.isDirty() && !this.dirty) {
            return;
        }
        const startTimeMs = new Date().getTime();

        this.webGl2RenderingContext.clear(this.webGl2RenderingContext.COLOR_BUFFER_BIT | this.webGl2RenderingContext.DEPTH_BUFFER_BIT);
        this.webGl2RenderingContext.viewport(0, 0, this.webGl2RenderingContext.canvas.width, this.webGl2RenderingContext.canvas.height);

        // Calculate projection/view for render pass
        this.projection = this.getCalculatedProjectionMatrix();
        this.view = this.getCalculatedViewMatrix(this.camera.distance, this.camera.orbit, this.camera.height, this.camera.focusPoint);

        // render entities
        this.renderEntities();
        // render renderer ui
        this.renderGrid();
        this.renderGimbal();
        // mark renderer as pristine
        this.markAsPristine();
        // statistics
        this.stats.passes++;
        this.stats.totalRenderTimeInMs = new Date().getTime() - startTimeMs;
    }
    private renderEntities() {
      this.webGl2RenderingContext.enable(this.webGl2RenderingContext.DEPTH_TEST);

      this.objectBroker.each((entity: number) => {
        if (!this.objectPropertiesBroker.isEntityEnabled(entity)) {
          return;
        }

        // Recalculate model if entity is dirty
        if (this.objectPropertiesBroker.isEntityDirty(entity)) {
          mat4.fromRotationTranslationScale(this.entityModelMatrix[entity] as mat4, this.objectPropertiesBroker.getRotationQuaternion(entity), this.objectPropertiesBroker.getTranslation(entity) as vec3, this.objectPropertiesBroker.getScale(entity) as vec3);
        }

        // Iterate through groups
        this.entityVertexGroups[entity]?.forEach((group) => {
          const shader = this.shaderBroker.get(group.material.shader);
          shader.bind();

          const color = [ group.material.color[0] / 255, group.material.color[1] / 255, group.material.color[2] / 255 ];
          this.webGl2RenderingContext.uniform3fv(shader.getUniformLocation("u_materialColor"), color);

          // Disable texture by default
          this.webGl2RenderingContext.uniform1i(shader.getUniformLocation("u_materialTextureUsed"), 0);
          if (!isNullOrUndefined(group.material.texture)) {
            // Bind image texture
            const glTexture = this.textureBroker.get(group.material.texture as Texture) as WebGLTexture;
            if (!isNullOrUndefined(glTexture)) {
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

          // Bind VAO and run draw call
          group.vao.bind();
          group.vao.drawElements();
          group.vao.unbind();

          // Cleanup material
          if (!isNullOrUndefined(group.material.texture)) {
            this.webGl2RenderingContext.activeTexture(this.webGl2RenderingContext.TEXTURE0);
            this.webGl2RenderingContext.bindTexture(this.webGl2RenderingContext.TEXTURE_2D, null);
          }
        });

        // Mark entity as pristine
        this.objectPropertiesBroker.entityRendered(entity);
      });
    }
    private renderGimbal() {
      if (!this.gimbal.enabled) {
        return;
      }

      const uiShader = this.shaderBroker.get(ShaderType.UI_SHADER);
      uiShader.bind();

      this.webGl2RenderingContext.viewport(25, 25, 100, 100);
      this.webGl2RenderingContext.disable(this.webGl2RenderingContext.DEPTH_TEST);

      this.webGl2RenderingContext.uniformMatrix4fv(uiShader.getUniformLocation("u_view"), false, this.getCalculatedViewMatrix(200, this.camera.orbit, this.camera.height, [ 0, 0, 0 ]));
      this.webGl2RenderingContext.uniform3fv(uiShader.getUniformLocation("u_materialColor"), [ 1, 1, 1 ]);
      this.webGl2RenderingContext.uniformMatrix4fv(uiShader.getUniformLocation("u_projection"), false, this.projection);
      this.webGl2RenderingContext.uniformMatrix4fv(uiShader.getUniformLocation("u_model"), false, mat4.create());

      this.gimbal.lines.drawLines();
    }
    private renderGrid() {
      if (!this.grid.enabled) {
        return;
      }

      const uiShader = this.shaderBroker.get(ShaderType.UI_SHADER);
      uiShader.bind();

      this.webGl2RenderingContext.enable(this.webGl2RenderingContext.DEPTH_TEST);

      this.webGl2RenderingContext.uniform3fv(uiShader.getUniformLocation("u_materialColor"), [ this.grid.color[0] / 255, this.grid.color[1] / 255, this.grid.color[2] / 255 ]);
      this.webGl2RenderingContext.uniformMatrix4fv(uiShader.getUniformLocation("u_projection"), false, this.projection);
      this.webGl2RenderingContext.uniformMatrix4fv(uiShader.getUniformLocation("u_view"), false, this.view);
      this.webGl2RenderingContext.uniformMatrix4fv(uiShader.getUniformLocation("u_model"), false, mat4.create());

      this.grid.vao.drawLines();
    }
    private generateGimbal() {
      const lineSize = 75;
      const bubbleSize = 8;

      this.gimbal = {
        enabled: true,
        lines: new VertexArrayObject(this.webGl2RenderingContext),
        bubbles: new VertexArrayObject(this.webGl2RenderingContext)
      }

      this.gimbal.lines.addVertices([
        // x
        new Vertex( [ 0, 0, 0 ], { color: [ 255, 0, 0 ] } ),
        new Vertex( [ lineSize, 0, 0 ], { color: [ 255, 0, 0 ] } ),
        // y
        new Vertex( [ 0, 1, 0 ], { color: [ 0, 0, 255 ] } ),
        new Vertex( [ 0, lineSize, 0 ], { color: [ 0, 0, 255 ] } ),
        // z
        new Vertex( [ 0, 0, 0 ], { color: [ 0, 255, 0 ] } ),
        new Vertex( [ 0, 0, lineSize ], { color: [ 0, 255, 0 ] } )
      ]);
      this.gimbal.lines.addIndices([
        0, 1,
        2, 3,
        4, 5
      ]);
    }
    private generateGrid() {
      const cols = 500;
      const rows = 500;
      const size = 10000;
      const offset = size / 2;

      const vao = new VertexArrayObject(this.webGl2RenderingContext);
      const vertices: Vertex[] = [];
      const indices: number[] = [];

      const options: VertexCreateOptions = {
        color: [ 230, 230, 230 ]
      }

      for (let z = 0; z < rows + 1; z++) {
        vertices.push(
          new Vertex([ -offset, 0, z * (size / rows) - offset ], options),
          new Vertex([ size - offset, 0, z * (size / rows) - offset ], options)
        );
        const indexOffset = indices.length;
        indices.push(indexOffset, 1 + indexOffset);
      }
      for (let x = 0; x < cols + 1; x++) {
        vertices.push(
          new Vertex([ x * (size / rows) - offset, 0, -offset ], options),
          new Vertex([ x * (size / rows) - offset, 0, size - offset ], options)
        );
        const indexOffset = indices.length;
        indices.push(indexOffset, 1 + indexOffset);
      }
      vao.addVertices(vertices);
      vao.addIndices(indices);
      this.grid = {
        orientation: [ 1, 0, 1 ],
        enabled: true,
        vao,
        color: [ 255, 255, 255 ]
      }
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
    setCameraNearClipPlane(near: number) {
      this.camera.near = near;
      this.markAsDirty();
    }
    setCameraFarClipPlane(far: number) {
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

    setEntityMaterialColor(entity: number, color: vec3) {
        if (isNullOrUndefined(this.entityVertexGroups[entity])) {
            return;
        }
        this.entityVertexGroups[entity]?.forEach((group) => {
          group.material.color = color;
        });
        this.objectPropertiesBroker.markEntityAsDirty(entity);
    }

    setEntityMaterialTexture(entity: number, texture: Texture | null) {
      if (isNullOrUndefined(this.entityVertexGroups[entity])) {
        return;
      }
      this.entityVertexGroups[entity]?.forEach((group) => {
        group.material.texture = texture;
      });
      this.objectPropertiesBroker.markEntityAsDirty(entity);
    }

    unsetEntityMaterialTexture(entity: number) {
      if (isNullOrUndefined(this.entityVertexGroups[entity])) {
        return;
      }
      this.entityVertexGroups[entity]?.forEach((group) => {
        group.material.texture = null;
      });
      this.objectPropertiesBroker.markEntityAsDirty(entity);
    }

    private markAsDirty() {
        this.dirty = true;
    }
    private markAsPristine() {
        this.dirty = false;
        this.textureBroker.markAsPristine();
        this.light.markAsPristine();
    }
}
