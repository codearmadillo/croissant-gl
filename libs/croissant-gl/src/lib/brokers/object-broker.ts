import {MAX_OBJECTS} from "../constants";

export class ObjectBroker {
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
            if (this.queue.indexOf(i) === -1) {
                callback(i);
            }
        }
    }
}
