import {ShaderProgram, ShaderType} from "../types/graphics";
import {objectShader} from "../graphics/shaders/shader.object";
import {uiShader} from "../graphics/shaders/shader.ui";

class ShaderBroker {
    private shaders: Map<ShaderType, ShaderProgram> = new Map();
    bootstrap() {
        // register shaders
        this.shaders.set(ShaderType.OBJECT_SHADER, objectShader);
        this.shaders.set(ShaderType.UI_SHADER, uiShader);
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
