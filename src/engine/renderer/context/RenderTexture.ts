import { Rectangle } from '../geometry/Rectangle';
import { ContextResource } from './ContextResource';
import { Texture } from './Texture';

export class RenderTexture extends ContextResource<WebGLFramebuffer> {
    protected _texture:Texture;
    protected readonly _height:int;
    protected readonly _width:int;

    public constructor(render:WebGLRenderingContext, width:int, height:int) {
        super(render);

        this._height = height;
        this._width = width;

        this.compose();
    }

    public compose():void {
        this._native = this._render.createFramebuffer();
        this._render.bindFramebuffer(this._render.FRAMEBUFFER, this._native);

        //-----------------------------------

        this._texture = new Texture(this._render);
        this._texture.createEmptyImage(this._width, this._height);

        this._render.framebufferTexture2D(
            this._render.FRAMEBUFFER,
            this._render.COLOR_ATTACHMENT0,
            this._render.TEXTURE_2D,
            this._texture.native,
            0
        );

        //-----------------------------------

        this._render.bindFramebuffer(this._render.FRAMEBUFFER, null);
    }

    public dispose():void {
        this._render.deleteFramebuffer(this._native);
        this._native = null;

        this._texture.dispose();
        this._texture = null;
    }

    public get bounds():Rectangle {
        return new Rectangle(0, 0, this._width, this._height);
    }

    public get target():Texture {
        return this._texture;
    }

    public get height():int {
        return this._height;
    }

    public get width():int {
        return this._width;
    }
}
