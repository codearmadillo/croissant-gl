import {DrawableType} from "./graphics/drawable-type";
import {mat4, quat, vec3} from "gl-matrix";
import {MAX_OBJECTS} from "./constants";
import {gl} from "./graphics/context";
import {defaultShader} from "./graphics/shader";

class ObjectPropertiesBroker {
    // Indices which are dirty and need to be recalculated when binding to context
    private dirty: Set<number> = new Set();
    private rotations: (vec3 | null)[] = [];
    private quats: (quat | null)[] = [];
    private translations: (vec3 | null)[] = [];
    private scales: (vec3 | null)[] = [];
    private models: (mat4 | null)[] = [];
    constructor() {
        for (let i = 0; i < MAX_OBJECTS; i++) {
            this.models[i] = null;
            this.rotations[i] = null;
            this.translations[i] = null;
            this.scales[i] = null;
            this.quats[i] = null;
        }
    }
    isDirty() {
        return this.dirty.size > 0;
    }
    create(entity: number, type: DrawableType) {
        this.rotations[entity] = type.rotation;
        this.scales[entity] = type.scale;
        this.translations[entity] = vec3.create();
        this.models[entity] = mat4.create();
        this.quats[entity] = quat.create();
        this.dirty.add(entity);
    }
    clear(entity: number) {
        this.models[entity] = null;
        this.rotations[entity] = null;
        this.translations[entity] = null;
        this.scales[entity] = null;
        this.quats[entity] = null;
    }
    translate(entity: number, translation: vec3) {
        this.translations[entity]![0] += translation[0];
        this.translations[entity]![1] += translation[1];
        this.translations[entity]![2] += translation[2];
        this.dirty.add(entity);
    }
    rotate(entity: number, rotation: vec3) {
        this.rotations[entity]![0] += rotation[0];
        this.rotations[entity]![1] += rotation[1];
        this.rotations[entity]![2] += rotation[2];
        this.dirty.add(entity);
    }
    scale(entity: number, scale: vec3) {
        this.scales[entity]![0] += scale[0];
        this.scales[entity]![1] += scale[1];
        this.scales[entity]![2] += scale[2];
        this.dirty.add(entity);
    }
    bind(entity: number) {
        if (this.dirty.has(entity)) {
            // recalculate
            quat.fromEuler(this.quats[entity] as quat, this.rotations[entity]![0], this.rotations[entity]![1], this.rotations[entity]![2]);
            mat4.fromRotationTranslation(this.models[entity] as mat4, this.quats[entity] as quat, this.translations[entity] as vec3);
            this.dirty.delete(entity);
        }
        gl().uniformMatrix4fv(defaultShader.getUniformLocation("u_model"), false, this.models[entity] as mat4);
    }
}
export const objectPropertiesBroker = new ObjectPropertiesBroker();