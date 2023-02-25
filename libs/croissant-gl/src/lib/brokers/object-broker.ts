import {MAX_OBJECTS} from "../constants";

export class ObjectBroker {
    private locked: Set<number> = new Set();
    private queue: number[] = [];
    private alive = 0;
    public get entityCount() {
        return this.alive;
    }
    constructor() {
        for (let i = 0; i < MAX_OBJECTS; i++) {
            this.queue.push(i);
        }
    }
    create(): number {
        this.alive++;
        return this.queue.shift() as number;
    }
    async createAsync(callback: (entity: number) => Promise<void> | void) {
        // get entity from queue, and lock it
        const entity = this.queue.shift() as number;
        this.locked.add(entity);
        // callback
        await callback(entity);
        // entity is now ready, unlock it and increase entity count
        this.locked.delete(entity);
        this.alive++;
        // return entity
        return entity;
    }
    destroy(entity: number) {
        this.queue.push(entity);
        this.alive--;
    }
    finalize() {
        for (let i = 0; i < MAX_OBJECTS; i++) {
            if (!this.queue.includes(i)) {
                this.destroy(i);
            }
        }
    }
    exists(entity: number) {
      return !this.queue.includes(entity);
    }
    /**
     * Iterates through active entities, if any
     * @param callback
     */
    each(callback: (entity: number) => void) {
        for (let i = 0; i < MAX_OBJECTS; i++) {
            if (this.queue.indexOf(i) === -1 && !this.locked.has(i)) {
                callback(i);
            }
        }
    }
    any() {
      return this.queue.length + this.locked.size !== MAX_OBJECTS;
    }
}
