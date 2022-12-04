import { Rectangle } from '../geometry/Rectangle';
import { ContextResource } from './ContextResource';
import { ImageSource } from './ImageSource';

export abstract class BaseTexture extends ContextResource<WebGLTexture> {
    protected _vertexData:Vector<float>;

    protected constructor(render:WebGLRenderingContext) {
        super(render);
    }

    public createSubTexture(region:Rectangle):BaseTexture {
        return null;
    }

    public abstract get bounds():Rectangle;

    public abstract get nativeHeight():int;

    public abstract get nativeWidth():int;

    public abstract get height():int;

    public abstract get width():int;

    public get vertexData():Vector<float> {
        return this._vertexData;
    }

    public get image():ImageSource {
        return null;
    }
}
