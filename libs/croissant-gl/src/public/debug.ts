import {DebugInfo} from "../lib/types/debug";
import {objectBroker} from "../lib/object-broker";
import {renderer} from "../lib/renderer";

/**
 * Returns information about current application state
 */
export function info(): DebugInfo {
    return {
        entities: objectBroker.entityCount,
        renderPasses: renderer.passes
    }
}