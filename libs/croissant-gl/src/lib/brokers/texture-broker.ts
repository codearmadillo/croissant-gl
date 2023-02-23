import {Texture, TextureOptions} from "../types/texture";
import {gl} from "../graphics/context";

const MAX_TEXTURES = 6;
class TextureBroker {
  private textures: (WebGLTexture | null)[] = [];
  private queue: number[] = [];
  private alive = 0;
  constructor() {
    for (let i = 0; i < MAX_TEXTURES; i++) {
      this.queue.push(i);
      this.textures.push(null);
    }
  }
  async create(imagePath: string, options: TextureOptions): Promise<Texture> {
    this.alive++;
    const texture = this.queue.shift() as Texture;

    // load texture
    const imageData = await this.loadTextureImage(imagePath);
    const glTexture = gl().createTexture();

    gl().bindTexture(gl().TEXTURE_2D, glTexture);

    gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_WRAP_S, this.getParsedWebGl2TextureOption(options.textureWrapS) ?? gl().REPEAT);
    gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_WRAP_T, this.getParsedWebGl2TextureOption(options.textureWrapT) ?? gl().REPEAT);
    gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_MIN_FILTER, this.getParsedWebGl2TextureOption(options.minificationFilter) ?? gl().NEAREST_MIPMAP_LINEAR);
    gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_MAG_FILTER, this.getParsedWebGl2TextureOption(options.magnificationFilter) ?? gl().LINEAR);

    gl().texImage2D(gl().TEXTURE_2D, 0, gl().RGBA, gl().RGBA, gl().UNSIGNED_BYTE, imageData);
    gl().bindTexture(gl().TEXTURE_2D, null);

    this.textures[texture] = glTexture;
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
      image.src = imagePath;
      image.onload = () => {
        resolve(image);
      };
      image.onerror = () => {
        reject();
      }
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
}
export const textureBroker = new TextureBroker();
