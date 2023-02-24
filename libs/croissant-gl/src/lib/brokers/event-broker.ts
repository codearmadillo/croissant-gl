import {EventType} from "../types/events";

export class EventBroker {
  private readonly eventCallbacks: Map<EventType, ((...args: any[]) => any)[]> = new Map();
  registerCallback(eventType: EventType, callback: (...args: any[]) => any) {
    if (!this.eventCallbacks.has(eventType)) {
      this.eventCallbacks.set(eventType, []);
    }
    this.eventCallbacks.get(eventType)?.push(callback);
  }
  emit(eventType: EventType) {
    if (!this.eventCallbacks.has(eventType)) {
      return;
    }
    this.eventCallbacks.get(eventType)?.forEach((cb) => cb());
  }
}
