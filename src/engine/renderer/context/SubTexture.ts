import { Rectangle } from '../geometry/Rectangle';
import { BaseTexture } from './BaseTexture';
import { ImageSource } from './ImageSource';
import { TextureUtil } from './TextureUtil';

export class SubTexture extends BaseTexture {
    protected readonly _parent:BaseTexture;
    protected readonly _region:Rectangle;

    public constructor(render:WebGLRenderingContext, parent:BaseTexture, region:Rectangle) {
        super(render);

        this._vertexData = TextureUtil.cacheVertexData(
            TextureUtil.normalizeBoundsData(
                parent, [
                    region.left,  region.top,
                    region.right, region.top,
                    region.right, region.bottom,
                    region.left,  region.bottom
                ]
            ),
            region.width,
            region.height
        );

        this._parent = parent;
        this._region = region;

        this.compose();
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
        return this._region.clone();
    }

    public get nativeHeight():int {
        return this._parent.nativeHeight;
    }

    public get nativeWidth():int {
        return this._parent.nativeWidth;
    }

    public get image():ImageSource {
        if (this._parent != null) {
            return this._parent.image;
        }

        return null;
    }

    public get height():int {
        return this._region.height;
    }

    public get width():int {
        return this._region.width;
    }
}
