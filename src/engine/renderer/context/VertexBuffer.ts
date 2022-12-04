import { Buffer } from './Buffer';
import { BufferType } from './BufferType';
import { BufferUsage } from './BufferUsage';

export class VertexBuffer extends Buffer<Float32Array> {
    public static readonly ELEMENT_SIZE:int = Float32Array.BYTES_PER_ELEMENT;

    public constructor(render:WebGLRenderingContext, bufferUsage:BufferUsage) {
        super(render, BufferType.VERTEX, bufferUsage);
    }

    public uploadBufferWithOffset(source:Float32Array | ArrayBuffer, offset:int):void {
        super.uploadBufferWithOffset(source, offset * VertexBuffer.ELEMENT_SIZE);
    }
}
