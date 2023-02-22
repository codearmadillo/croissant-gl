import {ShaderProgram, ShaderType} from "./types/graphics";
import {defaultShader} from "./graphics/shader";

class ShaderBroker {
    private shaders: Map<ShaderType, ShaderProgram> = new Map();
    bootstrap() {
        // register shaders
        this.shaders.set(ShaderType.OBJECT_SHADER, defaultShader);
        // bootstrap shaders
        this.shaders.forEach((shader) => {
            shader.bootstrap();
        });
    }
    get(type: ShaderType): ShaderProgram {
        if (!this.shaders.has(type)) {
            throw new Error(`Undefined shader of type '${type}'`);
        }
        return this.shaders.get(type) as ShaderProgram;
    }
}
export const shaderBroker = new ShaderBroker();