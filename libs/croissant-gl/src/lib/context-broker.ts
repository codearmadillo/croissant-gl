import {CroissantGlContext} from "./context";

const MAX_CONTEXTS = 32;
class ContextBroker {
  private contexts: (CroissantGlContext | null)[] = [];
  private queue: number[] = [];
  private alive = 0;
  public get contextCount() {
    return this.alive;
  }
  constructor() {
    for (let i = 0; i < MAX_CONTEXTS; i++) {
      this.queue.push(i);
      this.contexts.push(null);
    }
  }
  create(canvas: HTMLCanvasElement): number {
    this.alive++;
    const contextId = this.queue.shift() as number;
    this.contexts[contextId] = new CroissantGlContext(canvas, contextId);
    return contextId;
  }
  destroy(context: number) {
    this.queue.push(context);
    this.alive--;
  }
  getOrThrow(context: number): CroissantGlContext {
    if (this.queue.includes(context)) {
      throw new Error(`Context with id '${context}' not found`);
    }
    return this.contexts[context] as CroissantGlContext;
  }
}
export const contextBroker = new ContextBroker();
