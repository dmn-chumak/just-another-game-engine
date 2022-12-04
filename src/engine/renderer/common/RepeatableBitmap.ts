import { NumberUtil } from '../../utils/NumberUtil';
import { BaseTexture } from '../context/BaseTexture';
import { TextureUtil } from '../context/TextureUtil';
import { Point } from '../geometry/Point';
import { Material } from '../materials/Material';
import { Renderer } from '../Renderer';
import { QUAD_VTX_COUNT } from '../Vector';
import { QUAD_IDX_COUNT } from '../Vector';
import { Bitmap } from './Bitmap';

export class RepeatableBitmap extends Bitmap {
    protected _offset:Point;
    protected _width:float;
    protected _height:float;

    public constructor(texture:BaseTexture = null, material:Material = null) {
        super(texture, material);

        this._offset = new Point();
        this._width = 0;
        this._height = 0;
    }

    public render(render:Renderer):void {
        if (this._texture == null || this._visible === false) {
            return;
        }

        //-----------------------------------

        render.attachEntityState(this);

        //-----------------------------------

        const offsetY = Math.floor(Math.abs(this._offset.y)) % this._texture.height;
        const offsetX = Math.floor(Math.abs(this._offset.x)) % this._texture.width;

        const tilesPerRow = Math.ceil((this._height + offsetY) / this._texture.height);
        const tilesPerColumn = Math.ceil((this._width + offsetX) / this._texture.width);
        const tilesCount = tilesPerRow * tilesPerColumn;

        render.attachMaterialWithTexture(this._material, this._texture, null, this._blendMode);
        render.attachIndexesData(tilesCount * QUAD_IDX_COUNT);

        const vertexDataPointer = render.createVertexesDataPointer(tilesCount * QUAD_VTX_COUNT);
        const dataDelta = this._material.strideElements * QUAD_VTX_COUNT;

        //-----------------------------------

        let index = 0;

        //-----------------------------------

        for (let row = 0; row < tilesPerRow; row++) {
            const tileY = row * this._texture.height + offsetY * NumberUtil.getSign(this._offset.y);

            for (let col = 0; col < tilesPerColumn; col++) {
                const tileX = col * this._texture.width + offsetX * NumberUtil.getSign(this._offset.x);

                TextureUtil.copyVertexDataWithOffsets(
                    vertexDataPointer,
                    this._material,
                    this._texture.vertexData,
                    tileX, tileY,
                    render.state.matrix,
                    render.state.alpha,
                    index * dataDelta
                );

                index++;
            }
        }

        //-----------------------------------

        render.detachEntityState();
    }

    public set offset(value:Point) {
        this._offset = value;
    }

    public set height(value:float) {
        this._height = value;
    }

    public set width(value:float) {
        this._width = value;
    }

    public get offset():Point {
        return this._offset;
    }

    public get height():float {
        return this._height;
    }

    public get width():float {
        return this._width;
    }
}
