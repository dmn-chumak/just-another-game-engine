import { ContextResource } from './ContextResource';
import { ShaderType } from './ShaderType';

export class Shader extends ContextResource<WebGLShader> {
    protected readonly _source:string;
    protected readonly _type:GLenum;

    public constructor(render:WebGLRenderingContext, shaderType:ShaderType, source:string) {
        super(render);

        this._source = source;
        this._type = this.resolveShaderType(shaderType);

        this.compose();
    }

    protected resolveShaderType(shaderType:ShaderType):GLenum {
        if (shaderType === ShaderType.FRAGMENT) {
            return this._render.FRAGMENT_SHADER;
        } else {
            return this._render.VERTEX_SHADER;
        }
    }

    public compose():void {
        this._native = this._render.createShader(this._type);

        this._render.shaderSource(this._native, this._source);
        this._render.compileShader(this._native);

        if (this._render.getShaderParameter(this._native, this._render.COMPILE_STATUS) === false) {
            const status = this._render.getShaderInfoLog(this._native).trim();

            if (status.length !== 0) {
                throw new Error('Shader compilation failed [' + status + '].');
            } else {
                throw new Error('Shader compilation failed.');
            }
        }
    }

    public dispose():void {
        this._render.deleteShader(this._native);
        this._native = null;
    }
}
