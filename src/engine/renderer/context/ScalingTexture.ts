import { Point } from '../geometry/Point';
import { Rectangle } from '../geometry/Rectangle';
import { BaseTexture } from './BaseTexture';
import { TextureUtil } from './TextureUtil';

export class ScalingTexture extends BaseTexture {
    protected readonly _parent:BaseTexture;
    protected readonly _margin:Point;

    public constructor(render:WebGLRenderingContext, parent:BaseTexture, region:Rectangle) {
        super(render);

        this._margin = new Point();
        this._margin.y = parent.height - region.height;
        this._margin.x = parent.width - region.width;
        this._parent = parent;

        this.cacheScalingData([
            0,            0,
            region.left,  0,
            region.right, 0,
            parent.width, 0,

            0,            region.top,
            region.left,  region.top,
            region.right, region.top,
            parent.width, region.top,

            0,            region.bottom,
            region.left,  region.bottom,
            region.right, region.bottom,
            parent.width, region.bottom,

            0,            parent.height,
            region.left,  parent.height,
            region.right, parent.height,
            parent.width, parent.height

            /*
                0 -- 1 ----- 2 -- 3
                |  \ |     \ |  \ |
                4 -- 5 ----- 6 -- 7
                |  \ |     \ |  \ |
                8 -- 9 ----- 10 - 11
                |  \ |     \ |  \ |
                12 - 13 ---- 14 - 15
            */
        ]);

        this.compose();
    }

    protected cacheScalingData(sourceBoundsData:Vector<float>):void {
        this._vertexData = [];

        const coordsVertexData = sourceBoundsData.concat();
        const boundsData = TextureUtil.normalizeBoundsData(this._parent, sourceBoundsData);
        const vertexCount = boundsData.length;

        for (let index = 0, offset = 0; index < vertexCount; index += 2) {
            this._vertexData[offset++] = coordsVertexData[index];
            this._vertexData[offset++] = coordsVertexData[index + 1];
            this._vertexData[offset++] = boundsData[index];
            this._vertexData[offset++] = boundsData[index + 1];
        }
    }

    public compose():void {
        if (this._parent != null) {
            this._native = this._parent.native;
        }
    }

    public dispose():void {
        this._native = null;
    }

    public get bounds():Rectangle {
        return this._parent.bounds;
    }

    public get nativeHeight():int {
        return this._parent.nativeHeight;
    }

    public get nativeWidth():int {
        return this._parent.nativeWidth;
    }

    public get margin():Point {
        return this._margin;
    }

    public get height():int {
        return this._parent.height;
    }

    public get width():int {
        return this._parent.width;
    }
}
