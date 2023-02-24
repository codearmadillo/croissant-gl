import {defaultTextureOptions, Texture, TextureOptions} from "../lib/types/texture";
import {contextBroker} from "../lib/context-broker";

export function create(context: number, image: string, options: Partial<TextureOptions> = defaultTextureOptions) {
  const combinedOptions = {
    ...defaultTextureOptions,
    ...options
  }
  return contextBroker.getOrThrow(context).textureBroker.create(image, combinedOptions);
}
export function destroy(context: number, texture: Texture) {
  contextBroker.getOrThrow(context).textureBroker.destroy(texture);
}
