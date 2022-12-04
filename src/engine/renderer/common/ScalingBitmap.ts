import { ResourceManager } from '../../system/ResourceManager';
import { BlendMode } from '../context/BlendMode';
import { ScalingTexture } from '../context/ScalingTexture';
import { TextureUtil } from '../context/TextureUtil';
import { DefaultMaterial } from '../materials/default/content';
import { Renderer } from '../Renderer';
import { DisplayObject } from './DisplayObject';

export class ScalingBitmap extends DisplayObject {
    protected static readonly INDICES_DATA:Vector<int> = [
        0,  1,  5,
        5,  4,  0,
        1,  2,  6,
        6,  5,  1,
        2,  3,  7,
        7,  6,  2,

        4,  5,  9,
        9,  8,  4,
        5,  6,  10,
        10, 9,  5,
        6,  7,  11,
        11, 10, 6,

        8,  9,  13,
        13, 12, 8,
        9,  10, 14,
        14, 13, 9,
        10, 11, 15,
        15, 14, 10
    ];

    protected _cachedVertexData:Vector<float>;
    protected _blendMode:BlendMode;
    protected _texture:ScalingTexture;

    public constructor(texture:ScalingTexture = null) {
        super(ResourceManager.obtainMaterial(DefaultMaterial.NAME));

        this._cachedVertexData = null;
        this._blendMode = BlendMode.NORMAL;

        if (texture != null) {
            this.texture = texture;
        }
    }

    public render(render:Renderer):void {
        if (this._texture == null || this._visible === false) {
            return;
        }

        //-----------------------------------

        render.attachEntityState(this);
        render.attachMaterialWithTexture(this._material, this._texture, null, this._blendMode);
        render.attachIndexesData(54, ScalingBitmap.INDICES_DATA);

        //-----------------------------------

        TextureUtil.copyVertexData(
            render.createVertexesDataPointer(16),
            this._material, this._cachedVertexData,
            render.state.matrix,
            render.state.alpha
        );

        //-----------------------------------

        render.detachEntityState();
    }

    public set blendMode(value:BlendMode) {
        this._blendMode = value;
    }

    public set texture(value:ScalingTexture) {
        this._cachedVertexData = value.vertexData.concat();
        this._texture = value;
    }

    public get blendMode():BlendMode {
        return this._blendMode;
    }

    public get texture():ScalingTexture {
        return this._texture;
    }

    public set height(value:float) {
        const data = this._cachedVertexData;
        data[33] = data[37] = data[41] = data[45] = value - this._texture.margin.y;
        data[49] = data[53] = data[57] = data[61] = value;
    }

    public set width(value:float) {
        const data = this._cachedVertexData;
        data[8] = data[24] = data[40] = data[56] = value - this._texture.margin.x;
        data[12] = data[28] = data[44] = data[60] = value;
    }
}
