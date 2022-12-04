import { Matrix } from '../geometry/Matrix';
import { Material } from '../materials/Material';
import { BaseTexture } from './BaseTexture';

export class TextureUtil {
    public static readonly DUMMY_VERTEX_DATA:Vector<float> = [
        0, 0,
        1, 0,
        1, 1,
        0, 1

        /*
           0 - 1
           | \ |
           3 - 2
        */
    ];

    public static copyVertexData(targetVertexData:Float32Array, material:Material, sourceVertexData:Vector<float>, matrix:Matrix, alpha:float = 1, offset:int = 0):void {
        const originalStride = material.strideElements;
        const dataLength = sourceVertexData.length;
        const skippedStride = originalStride - 5;

        for (let index = 0; index < dataLength; index += 4, offset += skippedStride) {
            targetVertexData[offset++] = Matrix.transformAxisX(matrix, sourceVertexData[index], sourceVertexData[index + 1]);
            targetVertexData[offset++] = Matrix.transformAxisY(matrix, sourceVertexData[index], sourceVertexData[index + 1]);

            targetVertexData[offset++] = sourceVertexData[index + 2];
            targetVertexData[offset++] = sourceVertexData[index + 3];
            targetVertexData[offset++] = alpha;
        }
    }

    public static copyVertexDataWithOffsets(targetVertexData:Float32Array, material:Material, sourceVertexData:Vector<float>, offsetX:float, offsetY:float, matrix:Matrix, alpha:float = 1, offset:int = 0):void {
        const originalStride = material.strideElements;
        const dataLength = sourceVertexData.length;
        const skippedStride = originalStride - 5;

        for (let index = 0; index < dataLength; index += 4, offset += skippedStride) {
            targetVertexData[offset++] = Matrix.transformAxisX(matrix, sourceVertexData[index] + offsetX, sourceVertexData[index + 1] + offsetY);
            targetVertexData[offset++] = Matrix.transformAxisY(matrix, sourceVertexData[index] + offsetX, sourceVertexData[index + 1] + offsetY);

            targetVertexData[offset++] = sourceVertexData[index + 2];
            targetVertexData[offset++] = sourceVertexData[index + 3];
            targetVertexData[offset++] = alpha;
        }
    }

    public static normalizeBoundsData(parent:BaseTexture, boundsData:Vector<float>):Vector<float> {
        const dataLength = boundsData.length;

        const nativeHeight = parent.nativeHeight;
        const nativeWidth = parent.nativeWidth;
        const parentBounds = parent.bounds;

        for (let index = 0; index < dataLength; index += 2) {
            boundsData[index + 1] = (boundsData[index + 1] + parentBounds.y) / nativeHeight;
            boundsData[index] = (boundsData[index] + parentBounds.x) / nativeWidth;
        }

        return boundsData;
    }

    public static cacheVertexData(boundsData:Vector<float>, width:int, height:int):Vector<float> {
        const dummyVertexData = TextureUtil.DUMMY_VERTEX_DATA;
        const dataLength = boundsData.length;
        const vertexData:Vector<float> = [];

        for (let index = 0, offset = 0; index < dataLength; index += 2) {
            const indexModulo = (index % 8);

            vertexData[offset++] = dummyVertexData[indexModulo] * width;
            vertexData[offset++] = dummyVertexData[indexModulo + 1] * height;
            vertexData[offset++] = boundsData[index];
            vertexData[offset++] = boundsData[index + 1];
        }

        return vertexData;
    }
}
