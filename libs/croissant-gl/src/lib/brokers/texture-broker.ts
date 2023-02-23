import {Texture, TextureOptions} from "../types/texture";
import {gl} from "../graphics/context";

const MAX_TEXTURES = 6;
class TextureBroker {
  private textures: (WebGLTexture | null)[] = [];
  private queue: number[] = [];
  private alive = 0;
  private dirty = false;
  constructor() {
    for (let i = 0; i < MAX_TEXTURES; i++) {
      this.queue.push(i);
      this.textures.push(null);
    }
  }
  isDirty() {
    return this.dirty;
  }
  create(imagePath: string, options: TextureOptions): Texture {
    this.alive++;
    const texture = this.queue.shift() as Texture;

    // Create WebGl2 texture
    const glTexture = gl().createTexture();
    this.textures[texture] = glTexture;
    gl().bindTexture(gl().TEXTURE_2D, glTexture);

    // set default texture
    gl().texImage2D(gl().TEXTURE_2D, 0, gl().RGBA, 1, 1, 0, gl().RGBA, gl().UNSIGNED_BYTE, new Uint8Array([ 0, 0, 255, 255 ]));

    // load texture
    this.loadTextureImage(imagePath).then((image) => {
      gl().bindTexture(gl().TEXTURE_2D, glTexture);
      gl().texImage2D(gl().TEXTURE_2D, 0, gl().RGBA, gl().RGBA, gl().UNSIGNED_BYTE, image);
      gl().bindTexture(gl().TEXTURE_2D, null);
      this.markAsDirty();
    }).catch((e) => {
      console.error(`Failed to load '${imagePath}'`, e);
    });

    // setup parameters
    gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_WRAP_S, this.getParsedWebGl2TextureOption(options.textureWrapS) ?? gl().REPEAT);
    gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_WRAP_T, this.getParsedWebGl2TextureOption(options.textureWrapT) ?? gl().REPEAT);
    gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_MIN_FILTER, this.getParsedWebGl2TextureOption(options.minificationFilter) ?? gl().NEAREST);
    gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_MAG_FILTER, this.getParsedWebGl2TextureOption(options.magnificationFilter) ?? gl().LINEAR);

    // unbind texture
    gl().bindTexture(gl().TEXTURE_2D, null);

    return texture;
  }
  destroy(texture: Texture) {
    this.queue.push(texture);
    this.alive--;
  }
  get(texture: Texture) {
    return this.textures[texture];
  }
  private loadTextureImage(imagePath: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.onerror = () => {
        reject();
      }
      image.src = imagePath;
      return image;
    });
  }
  private getParsedWebGl2TextureOption(option: string): GLenum | null {
    switch(option) {
      case 'linear':
        return gl().LINEAR;
      case 'nearest':
        return gl().NEAREST;
      case 'nearestMipmapNearest':
        return gl().NEAREST_MIPMAP_NEAREST;
      case 'linearMipmapNearest':
        return gl().LINEAR_MIPMAP_NEAREST;
      case 'nearestMipmapLinear':
        return gl().NEAREST_MIPMAP_LINEAR;
      case 'linearMipmapLinear':
        return gl().LINEAR_MIPMAP_LINEAR;
    }
    return null;
  }
  private markAsDirty() {
    this.dirty = true;
  }
  public markAsPristine() {
    this.dirty = false;
  }
}
export const textureBroker = new TextureBroker();
