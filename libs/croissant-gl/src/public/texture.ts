import {defaultTextureOptions, Texture, TextureOptions} from "../lib/types/texture";
import {textureBroker} from "../lib/brokers/texture-broker";

export function create(image: string, options: Partial<TextureOptions> = defaultTextureOptions) {
  const combinedOptions = {
    ...defaultTextureOptions,
    ...options
  }
  return textureBroker.create(image, combinedOptions);
}
export function destroy(texture: Texture) {
  textureBroker.destroy(texture);
}
