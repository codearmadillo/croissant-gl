export type Texture = number;
export interface TextureOptions {
  // Texture magnification filter
  magnificationFilter: 'linear' | 'nearest';
  // Texture minification filter
  minificationFilter: 'linear' | 'nearest' | 'nearestMipmapNearest' | 'linearMipmapNearest' | 'nearestMipmapLinear' | 'linearMipmapLinear';
  // Wrapping function for texture coordinate s
  textureWrapS: 'repeat' | 'clampToEdge' | 'mirroredRepeat';
  // Wrapping function for texture coordinate t
  textureWrapT: 'repeat' | 'clampToEdge' | 'mirroredRepeat';
}
export const defaultTextureOptions: TextureOptions = {
  magnificationFilter: 'linear',
  minificationFilter: 'nearestMipmapLinear',
  textureWrapS: 'repeat',
  textureWrapT: 'repeat'
}
