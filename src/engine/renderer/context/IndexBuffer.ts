import { Buffer } from './Buffer';
import { BufferType } from './BufferType';
import { BufferUsage } from './BufferUsage';

export class IndexBuffer extends Buffer<Uint16Array> {
    public static readonly ELEMENT_SIZE:int = Uint16Array.BYTES_PER_ELEMENT;

    public constructor(render:WebGLRenderingContext, bufferUsage:BufferUsage) {
        super(render, BufferType.INDEX, bufferUsage);
    }

    public uploadBufferWithOffset(source:Uint16Array | ArrayBuffer, offset:int):void {
        super.uploadBufferWithOffset(source, offset * IndexBuffer.ELEMENT_SIZE);
    }
}
