import {defaultTextureOptions, Texture, TextureOptions} from "../lib/types/texture";
import {contextBroker} from "../lib/context-broker";

/**
 * Creates a new texture from image URL
 * @param context CroissantGl context
 * @param imageUrl URL of image to load
 * @param options Texture options
 */
export async function create(context: number, imageUrl: string, options: Partial<TextureOptions> = defaultTextureOptions): Promise<number> {
  const combinedOptions = {
    ...defaultTextureOptions,
    ...options
  }
  return contextBroker.getOrThrow(context).textureBroker.createAsync(imageUrl, combinedOptions);
}

/**
 * Destroys texture
 * @param context CroissantGl context
 * @param texture Texture to destroy
 */
export function destroy(context: number, texture: Texture) {
  contextBroker.getOrThrow(context).objectPropertiesBroker.unsetMaterialTexture(texture);
  contextBroker.getOrThrow(context).textureBroker.destroy(texture);
}
