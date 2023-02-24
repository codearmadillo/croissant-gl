import {ShaderProgram, ShaderType} from "../types/graphics";
import {ObjectShader} from "../graphics/shaders/shader.object";
import {UiShader} from "../graphics/shaders/shader.ui";

export class ShaderBroker {
    private _shaders: Map<ShaderType, ShaderProgram> = new Map();
    private _webGl2RenderingContext: WebGL2RenderingContext;

    constructor(webGl2RenderingContext: WebGL2RenderingContext) {
      this._webGl2RenderingContext = webGl2RenderingContext;
    }

    bootstrap() {
        // register shaders
        this._shaders.set(ShaderType.OBJECT_SHADER, new ObjectShader());
        this._shaders.set(ShaderType.UI_SHADER, new UiShader());
        // bootstrap shaders
        this._shaders.forEach((shader) => {
            shader.bootstrap(this._webGl2RenderingContext);
        });
    }
    get(type: ShaderType): ShaderProgram {
        if (!this._shaders.has(type)) {
            throw new Error(`Undefined shader of type '${type}'`);
        }
        return this._shaders.get(type) as ShaderProgram;
    }
    finalize() {
      this._shaders.forEach((shader) => {
        shader.destroy();
      });
    }
}
