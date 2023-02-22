import {DebugInfo} from "../lib/types/debug";
import {objectBroker} from "../lib/brokers/object-broker";
import {renderer} from "../lib/renderer";

/**
 * Returns information about current application state
 */
export function info(): DebugInfo {
    return {
        entities: objectBroker.entityCount,
        passes: renderer.stats.passes,
        averageFrameTimeMs: renderer.stats.totalRenderTimeInMs / renderer.stats.passes
    }
}
