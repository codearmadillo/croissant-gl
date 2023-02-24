import {DrawableType} from "../graphics/drawable-type";
import {quat, vec3} from "gl-matrix";
import {MAX_OBJECTS} from "../constants";
import {EntityMaterial, EntityMeta, EntityTransform} from "../types/entity";
import {ShaderType} from "../types/graphics";
import {Texture} from "../types/texture";

export class ObjectPropertiesBroker {
    private entityTransform: (EntityTransform | null)[] = [];
    private entityMaterial: (EntityMaterial | null)[] = [];
    private entityMeta: (EntityMeta | null)[] = [];
    // Indices which are dirty and need to be recalculated when binding to context
    private dirty: Set<number> = new Set();

    constructor() {
        for (let i = 0; i < MAX_OBJECTS; i++) {
            this.resetEntityPointer(i);
        }
    }
    isDirty() {
        return this.dirty.size > 0;
    }
    entityCreated(entity: number, type: DrawableType) {
        this.entityTransform[entity] = {
            rotation: type.rotation,
            scale: type.scale,
            translation: vec3.create(),
            rotationQuat: quat.create()
        }
        this.setTransformRotationQuat(entity);
        this.entityMaterial[entity] = {
            color: type.color,
            shader: ShaderType.OBJECT_SHADER
        }
        this.entityMeta[entity] = {
            type: type.type,
            enabled: true
        }
        this.dirty.add(entity);
    }
    entityDestroyed(entity: number) {
        this.resetEntityPointer(entity);
    }
    entityRendered(entity: number) {
        this.markEntityAsPristine(entity);
    }
    private resetEntityPointer(entity: number) {
        this.entityTransform[entity] = null;
        this.entityMaterial[entity] = null;
        this.entityMeta[entity] = null;
    }
    translate(entity: number, translation: vec3) {
        this.entityTransform[entity]!.translation[0] += translation[0];
        this.entityTransform[entity]!.translation[1] += translation[1];
        this.entityTransform[entity]!.translation[2] += translation[2];
        this.markEntityAsDirty(entity);
    }
    rotate(entity: number, rotation: vec3) {
        this.entityTransform[entity]!.rotation[0] += rotation[0];
        this.entityTransform[entity]!.rotation[1] += rotation[1];
        this.entityTransform[entity]!.rotation[2] += rotation[2];
        this.setTransformRotationQuat(entity);
        this.markEntityAsDirty(entity);
    }
    scale(entity: number, scale: vec3) {
        this.entityTransform[entity]!.scale[0] += scale[0];
        this.entityTransform[entity]!.scale[1] += scale[1];
        this.entityTransform[entity]!.scale[2] += scale[2];
        this.markEntityAsDirty(entity);
    }
    setTranslation(entity: number, translation: vec3) {
        this.entityTransform[entity]!.translation = translation;
        this.markEntityAsDirty(entity);
    }
    setRotation(entity: number, rotation: vec3) {
        this.entityTransform[entity]!.rotation = rotation;
        this.setTransformRotationQuat(entity);
        this.markEntityAsDirty(entity);
    }
    setScale(entity: number, scale: vec3) {
        this.entityTransform[entity]!.scale = scale;
        this.markEntityAsDirty(entity);
    }
    enable(entity: number) {
        this.entityMeta[entity]!.enabled = true;
        this.dirty.add(entity);
    }
    disable(entity: number) {
        this.entityMeta[entity]!.enabled = false;
        this.dirty.add(entity);
    }
    getType(entity: number): string | null {
        if (this.entityMeta[entity] === null) {
            return null;
        }
        return this.entityMeta[entity]!.type;
    }
    getTranslation(entity: number): vec3 | null {
        if (this.entityTransform[entity] === null) {
            return null;
        }
        return [
            this.entityTransform[entity]!.translation[0],
            this.entityTransform[entity]!.translation[1],
            this.entityTransform[entity]!.translation[2]
        ];
    }
    getRotation(entity: number): vec3 | null {
        if (this.entityTransform[entity] === null) {
            return null;
        }
        return [
            this.entityTransform[entity]!.rotation[0],
            this.entityTransform[entity]!.rotation[1],
            this.entityTransform[entity]!.rotation[2]
        ]
    }
    getRotationQuaternion(entity: number): quat | null {
        if (this.entityTransform[entity] === null) {
            return null;
        }
        return this.entityTransform[entity]!.rotationQuat;
    }
    getScale(entity: number): vec3 | null {
        if (this.entityTransform[entity] === null) {
            return null;
        }
        return [
            this.entityTransform[entity]!.scale[0],
            this.entityTransform[entity]!.scale[1],
            this.entityTransform[entity]!.scale[2]
        ]
    }
    getMaterial(entity: number): EntityMaterial | null {
        if (this.entityMaterial[entity] === null) {
            return null;
        }
        return this.entityMaterial[entity]!;
    }
    setMaterialTexture(entity: number, texture: Texture | null) {
      if (this.entityMaterial[entity] === null) {
        return;
      }
      this.entityMaterial[entity]!.texture = texture;
    }
    isEntityEnabled(entity: number) {
        return this.entityMeta[entity]!.enabled ?? false;
    }
    isEntityDirty(entity: number) {
        return this.dirty.has(entity);
    }
    markEntityAsDirty(entity: number) {
        this.dirty.add(entity);
    }
    markEntityAsPristine(entity: number) {
        this.dirty.delete(entity);
    }
    private setTransformRotationQuat(entity: number) {
        this.entityTransform[entity]!.rotationQuat = quat.fromEuler(quat.create(), this.entityTransform[entity]!.rotation[0], this.entityTransform[entity]!.rotation[1], this.entityTransform[entity]!.rotation[2]);
    }
}
