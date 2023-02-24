import {DebugInfo} from "../lib/types/debug";
import {contextBroker} from "../lib/context-broker";

/**
 * Returns information about current application state
 * @param context CroissantGl context
 */
export function info(context: number): DebugInfo {
    const ctx = contextBroker.getOrThrow(context);
    return {
        entities: ctx?.objectBroker.entityCount,
        passes: ctx?.renderer.stats.passes,
        averageFrameTimeMs: ctx?.renderer.stats.totalRenderTimeInMs / ctx?.renderer.stats.passes
    }
}
