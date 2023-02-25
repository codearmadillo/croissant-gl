import {Texture, TextureOptions} from "../types/texture";

const MAX_TEXTURES = 6;
export class TextureBroker {
  private textures: (WebGLTexture | null)[] = [];
  private queue: number[] = [];
  private alive = 0;
  private dirty = false;
  private _webGl2RenderingContext: WebGL2RenderingContext;
  constructor(webGl2RenderingContext: WebGL2RenderingContext) {
    this._webGl2RenderingContext = webGl2RenderingContext;
    for (let i = 0; i < MAX_TEXTURES; i++) {
      this.queue.push(i);
      this.textures.push(null);
    }
  }
  isDirty() {
    return this.dirty;
  }
  createAsync(imagePath: string, options: TextureOptions): Promise<Texture> {
    this.alive++;
    const texture = this.queue.shift() as Texture;

    return new Promise<Texture>((resolve) => {
      // Create WebGl2 texture
      const glTexture = this._webGl2RenderingContext.createTexture();
      this.textures[texture] = glTexture;
      this._webGl2RenderingContext.bindTexture(this._webGl2RenderingContext.TEXTURE_2D, glTexture);

      // set default texture
      this._webGl2RenderingContext.texImage2D(this._webGl2RenderingContext.TEXTURE_2D, 0, this._webGl2RenderingContext.RGBA, 1, 1, 0, this._webGl2RenderingContext.RGBA, this._webGl2RenderingContext.UNSIGNED_BYTE, new Uint8Array([ 0, 0, 255, 255 ]));

      // load texture
      this.loadTextureImage(imagePath).then((image) => {
        this._webGl2RenderingContext.bindTexture(this._webGl2RenderingContext.TEXTURE_2D, glTexture);
        this._webGl2RenderingContext.texImage2D(this._webGl2RenderingContext.TEXTURE_2D, 0, this._webGl2RenderingContext.RGBA, this._webGl2RenderingContext.RGBA, this._webGl2RenderingContext.UNSIGNED_BYTE, image);
        this._webGl2RenderingContext.bindTexture(this._webGl2RenderingContext.TEXTURE_2D, null);
        this.markAsDirty();
      }).catch((e) => {
        console.error(`Failed to load '${imagePath}'`, e);
      });

      // setup parameters
      this._webGl2RenderingContext.texParameteri(this._webGl2RenderingContext.TEXTURE_2D, this._webGl2RenderingContext.TEXTURE_WRAP_S, this.getParsedWebGl2TextureOption(options.textureWrapS) ?? this._webGl2RenderingContext.REPEAT);
      this._webGl2RenderingContext.texParameteri(this._webGl2RenderingContext.TEXTURE_2D, this._webGl2RenderingContext.TEXTURE_WRAP_T, this.getParsedWebGl2TextureOption(options.textureWrapT) ?? this._webGl2RenderingContext.REPEAT);
      this._webGl2RenderingContext.texParameteri(this._webGl2RenderingContext.TEXTURE_2D, this._webGl2RenderingContext.TEXTURE_MIN_FILTER, this.getParsedWebGl2TextureOption(options.minificationFilter) ?? this._webGl2RenderingContext.NEAREST);
      this._webGl2RenderingContext.texParameteri(this._webGl2RenderingContext.TEXTURE_2D, this._webGl2RenderingContext.TEXTURE_MAG_FILTER, this.getParsedWebGl2TextureOption(options.magnificationFilter) ?? this._webGl2RenderingContext.LINEAR);

      // unbind texture
      this._webGl2RenderingContext.bindTexture(this._webGl2RenderingContext.TEXTURE_2D, null);

      // resolve
      resolve(texture);
    });
  }
  finalize() {
    for (let i = 0; i < MAX_TEXTURES; i++) {
      if (!this.queue.includes(i)) {
          this.destroy(i);
      }
    }
  }
  destroy(texture: Texture) {
    this._webGl2RenderingContext.deleteTexture(this.textures[texture]);

    this.queue.push(texture);
    this.alive--;

    this.markAsDirty();
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
        return this._webGl2RenderingContext.LINEAR;
      case 'nearest':
        return this._webGl2RenderingContext.NEAREST;
      case 'nearestMipmapNearest':
        return this._webGl2RenderingContext.NEAREST_MIPMAP_NEAREST;
      case 'linearMipmapNearest':
        return this._webGl2RenderingContext.LINEAR_MIPMAP_NEAREST;
      case 'nearestMipmapLinear':
        return this._webGl2RenderingContext.NEAREST_MIPMAP_LINEAR;
      case 'linearMipmapLinear':
        return this._webGl2RenderingContext.LINEAR_MIPMAP_LINEAR;
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
