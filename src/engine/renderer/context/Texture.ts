import { Rectangle } from '../geometry/Rectangle';
import { BaseTexture } from './BaseTexture';
import { ImageSource } from './ImageSource';
import { SubTexture } from './SubTexture';
import { TextureUtil } from './TextureUtil';

export class Texture extends BaseTexture {
    protected _image:ImageSource;
    protected _height:int;
    protected _width:int;

    public constructor(render:WebGLRenderingContext) {
        super(render);

        this._image = null;
        this._height = 0;
        this._width = 0;

        this.compose();
    }

    protected updateDimensions(width:int, height:int):void {
        this._vertexData = TextureUtil.cacheVertexData(
            TextureUtil.DUMMY_VERTEX_DATA,
            width, height
        );

        this._height = height;
        this._width = width;
    }

    public createSubTexture(region:Rectangle):BaseTexture {
        return new SubTexture(this._render, this, region);
    }

    public createEmptyImage(width:int, height:int):void {
        this._render.bindTexture(this._render.TEXTURE_2D, this._native);
        this._render.texImage2D(
            this._render.TEXTURE_2D, 0, this._render.RGBA,
            width, height, 0,
            this._render.RGBA, this._render.UNSIGNED_BYTE,
            null
        );

        this.updateDimensions(width, height);
    }

    public uploadFromBuffer(image:ArrayBufferView, width:int, height:int):void {
        this._render.bindTexture(this._render.TEXTURE_2D, this._native);
        this._render.texImage2D(
            this._render.TEXTURE_2D, 0, this._render.RGBA,
            width, height, 0,
            this._render.RGBA, this._render.UNSIGNED_BYTE,
            image
        );

        this.updateDimensions(width, height);
    }

    public uploadFromImage(image:ImageSource):void {
        this._image = image;

        this._render.bindTexture(this._render.TEXTURE_2D, this._native);
        this._render.texImage2D(
            this._render.TEXTURE_2D, 0, this._render.RGBA,
            this._render.RGBA, this._render.UNSIGNED_BYTE,
            image
        );

        this.updateDimensions(
            image.width,
            image.height
        );
    }

    public changeFloatParameter(param:GLenum, value:GLfloat):void {
        this._render.bindTexture(this._render.TEXTURE_2D, this._native);
        this._render.texParameterf(this._render.TEXTURE_2D, param, value);
    }

    public changeIntParameter(param:GLenum, value:GLint):void {
        this._render.bindTexture(this._render.TEXTURE_2D, this._native);
        this._render.texParameteri(this._render.TEXTURE_2D, param, value);
    }

    public updateWrapParameter(repeatable:boolean):void {
        const value = repeatable ? this._render.REPEAT : this._render.CLAMP_TO_EDGE;
        this.changeIntParameter(this._render.TEXTURE_WRAP_S, value);
        this.changeIntParameter(this._render.TEXTURE_WRAP_T, value);
    }

    public compose():void {
        this._native = this._render.createTexture();

        this.changeIntParameter(this._render.TEXTURE_MIN_FILTER, this._render.LINEAR);
        this.changeIntParameter(this._render.TEXTURE_MAG_FILTER, this._render.LINEAR);
        this.updateWrapParameter(false);
    }

    public dispose():void {
        this._render.deleteTexture(this._native);
        this._native = null;
    }

    public get bounds():Rectangle {
        return new Rectangle(0, 0, this._width, this._height);
    }

    public get nativeHeight():int {
        return this._height;
    }

    public get nativeWidth():int {
        return this._width;
    }

    public get image():ImageSource {
        return this._image;
    }

    public get height():int {
        return this._height;
    }

    public get width():int {
        return this._width;
    }
}
