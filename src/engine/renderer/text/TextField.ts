import { ResourceManager } from '../../system/ResourceManager';
import { System } from '../../system/System';
import { DisplayObject } from '../common/DisplayObject';
import { Color } from '../context/Color';
import { TextureUtil } from '../context/TextureUtil';
import { DistanceFieldMaterial } from '../materials/distanceField/content';
import { Renderer } from '../Renderer';
import { QUAD_VTX_COUNT } from '../Vector';
import { QUAD_IDX_COUNT } from '../Vector';
import { BitmapCharLocation } from './BitmapCharLocation';
import { BitmapFont } from './BitmapFont';

export class TextField extends DisplayObject {
    private _isCacheValid:boolean;
    private _cachedWidth:int;

    private _bitmapCache:Vector<BitmapCharLocation>;
    private _bitmapUniforms:Dictionary<Float32Array>;
    private _bitmapFont:BitmapFont;

    private _textSize:int;
    private _textColor:int;
    private _text:string;

    public constructor(text:string = '', font:string = 'Verdana', color:int = 0xFFFFFF, size:int = 12) {
        super(ResourceManager.obtainMaterial(DistanceFieldMaterial.NAME));

        this._bitmapFont = ResourceManager.obtainBitmapFont(font);
        this._isCacheValid = false;
        this._bitmapUniforms = null;
        this._bitmapCache = null;
        this._cachedWidth = 0;

        this._textSize = size;
        this._textColor = color;
        this._text = text;
    }

    protected renderTextField(render:Renderer):void {
        const charsCount = this._bitmapCache.length;

        //-----------------------------------

        render.attachParticlesCount(charsCount);
        render.attachMaterialWithTexture(this._material, this._bitmapFont.texture, this._bitmapUniforms);
        render.attachIndexesData(charsCount * QUAD_IDX_COUNT);

        const textHalfWidth = -this._cachedWidth / 2;
        const vertexDataPointer = render.createVertexesDataPointer(charsCount * QUAD_VTX_COUNT);
        const dataDelta = this._material.strideElements * QUAD_VTX_COUNT;

        //-----------------------------------

        for (let index = 0; index < charsCount; index++) {
            const location = this._bitmapCache[index];
            const offset = index * dataDelta;

            TextureUtil.copyVertexDataWithOffsets(
                vertexDataPointer,
                this._material,
                location.char.texture.vertexData,
                location.x + textHalfWidth, location.y,
                render.state.matrix,
                render.state.alpha,
                offset
            );
        }
    }

    protected recomposeTextFieldCache():void {
        if (this._isCacheValid === false) {
            const charsScale = this._textSize / 32;
            const length = this._text.length;
            const letterSpacing = 2;

            //-----------------------------------

            this.scale = charsScale;

            this._bitmapUniforms = {
                [DistanceFieldMaterial.SCREEN_SCALE_UNIFORM]: new Float32Array([ System.stage.stageWidth, System.stage.stageHeight ]),
                [DistanceFieldMaterial.COLOR_UNIFORM]: Color.createFloatArray(this._textColor)
            };

            this._bitmapCache = [];
            this._isCacheValid = true;
            this._cachedWidth = 0;

            //-----------------------------------

            for (let index = 0; index < length; index++) {
                const bitmapChar = this._bitmapFont.charsMap[this._text.charCodeAt(index)];

                if (bitmapChar != null) {
                    const location = new BitmapCharLocation(bitmapChar, this._cachedWidth + bitmapChar.offsetX, bitmapChar.offsetY);
                    this._cachedWidth += bitmapChar.advanceX + letterSpacing;
                    this._bitmapCache.push(location);
                }
            }
        }
    }

    public render(render:Renderer):void {
        if (this._visible) {
            this.recomposeTextFieldCache();

            render.attachEntityState(this);
            this.renderTextField(render);
            render.detachEntityState();
        }
    }

    public set color(value:int) {
        this._isCacheValid = false;
        this._textColor = value;
    }

    public set text(value:string) {
        this._isCacheValid = false;
        this._text = value;
    }

    public set size(value:int) {
        this._isCacheValid = false;
        this._textSize = value;
    }

    public get cachedWidth():int {
        if (this._isCacheValid === false) {
            this.recomposeTextFieldCache();
        }

        return this._cachedWidth;
    }

    public get color():int {
        return this._textColor;
    }

    public get text():string {
        return this._text;
    }

    public get size():int {
        return this._textSize;
    }
}
