import { BufferType } from './BufferType';
import { BufferUsage } from './BufferUsage';
import { ContextResource } from './ContextResource';
import { TypedArray } from './TypedArray';

export abstract class Buffer<ValueType extends TypedArray> extends ContextResource<WebGLBuffer> {
    protected readonly _target:GLenum;
    protected readonly _usageType:GLenum;
    protected readonly _length:int;

    protected constructor(render:WebGLRenderingContext, bufferType:BufferType, bufferUsage:BufferUsage, length:int = 64) {
        super(render);

        this._target = this.resolveBufferTarget(bufferType);
        this._usageType = this.resolveBufferUsage(bufferUsage);
        this._length = length;

        this.compose();
    }

    protected resolveBufferUsage(bufferUsage:BufferUsage):GLenum {
        if (bufferUsage === BufferUsage.DYNAMIC_DRAW) {
            return this._render.DYNAMIC_DRAW;
        } else {
            return this._render.STATIC_DRAW;
        }
    }

    protected resolveBufferTarget(bufferType:BufferType):GLenum {
        if (bufferType === BufferType.INDEX) {
            return this._render.ELEMENT_ARRAY_BUFFER;
        } else {
            return this._render.ARRAY_BUFFER;
        }
    }

    public uploadBuffer(source:ValueType | ArrayBuffer):void {
        this._render.bindBuffer(this._target, this._native);
        this._render.bufferData(this._target, source, this._usageType);
    }

    public uploadBufferWithOffset(source:ValueType | ArrayBuffer, offset:int):void {
        this._render.bindBuffer(this._target, this._native);
        this._render.bufferSubData(this._target, offset, source);
    }

    public compose():void {
        this._native = this._render.createBuffer();
        this._render.bindBuffer(this._target, this._native);
        this._render.bufferData(this._target, this._length, this._usageType);
    }

    public dispose():void {
        this._render.deleteBuffer(this._native);
        this._native = null;
    }

    public get length():int {
        return this._length;
    }
}
