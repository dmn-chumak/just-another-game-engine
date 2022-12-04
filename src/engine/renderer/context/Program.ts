import { BaseTexture } from './BaseTexture';
import { ContextResource } from './ContextResource';
import { Shader } from './Shader';

export class Program extends ContextResource<WebGLProgram> {
    private readonly _fragmentShader:Shader;
    private readonly _vertexShader:Shader;

    public constructor(render:WebGLRenderingContext, fragmentShader:Shader, vertexShader:Shader) {
        super(render);

        this._fragmentShader = fragmentShader;
        this._vertexShader = vertexShader;

        this.compose();
    }

    public connectAttributePointer(location:WebGLAttribLocation, length:int, stride:int, offset:int):void {
        this._render.enableVertexAttribArray(location);
        this._render.vertexAttribPointer(
            location,
            length, this._render.FLOAT, false,
            stride,
            offset
        );
    }

    public connectTextureSampler(location:WebGLUniformLocation, texture:BaseTexture, sampler:int):void {
        this._render.activeTexture(this._render.TEXTURE0 + sampler);
        this._render.bindTexture(this._render.TEXTURE_2D, texture.native);
        this._render.uniform1i(location, sampler);
    }

    public connectUniformMatrix(location:WebGLUniformLocation, length:int, value:Float32Array):void {
        if (length === 16) {
            this._render.uniformMatrix4fv(location, false, value);
        } else {
            this._render.uniformMatrix3fv(location, false, value);
        }
    }

    public connectUniformValue(location:WebGLUniformLocation, length:int, value:Float32Array):void {
        if (length === 4) {
            this._render.uniform4fv(location, value);
        } else if (length === 3) {
            this._render.uniform3fv(location, value);
        } else if (length === 2) {
            this._render.uniform2fv(location, value);
        } else {
            this._render.uniform1fv(location, value);
        }
    }

    public resolveUniformLocation(name:string):WebGLUniformLocation {
        return this._render.getUniformLocation(this._native, name);
    }

    public resolveAttributeLocation(name:string):WebGLAttribLocation {
        return this._render.getAttribLocation(this._native, name);
    }

    public compose():void {
        this._native = this._render.createProgram();

        this._render.attachShader(this._native, this._fragmentShader.native);
        this._render.attachShader(this._native, this._vertexShader.native);
        this._render.linkProgram(this._native);
        this._render.validateProgram(this._native);

        if (this._render.getProgramParameter(this._native, this._render.LINK_STATUS) === false) {
            const status = this._render.getProgramInfoLog(this._native).trim();

            if (status.length !== 0) {
                throw new Error('Program linking failed [' + status + '].');
            } else {
                throw new Error('Program linking failed.');
            }
        }
    }

    public dispose():void {
        this._render.detachShader(this._native, this._fragmentShader.native);
        this._render.detachShader(this._native, this._vertexShader.native);
        this._render.deleteProgram(this._native);
        this._native = null;
    }
}
