import { ResourceManager } from '../../system/ResourceManager';
import { Align } from '../Align';
import { BaseTexture } from '../context/BaseTexture';
import { BlendMode } from '../context/BlendMode';
import { TextureUtil } from '../context/TextureUtil';
import { DefaultMaterial } from '../materials/default/content';
import { Material } from '../materials/Material';
import { Renderer } from '../Renderer';
import { DisplayObject } from './DisplayObject';

export class Bitmap extends DisplayObject {
    protected _blendMode:BlendMode;
    protected _texture:BaseTexture;

    public constructor(texture:BaseTexture = null, material:Material = null) {
        if (material == null) {
            material = ResourceManager.obtainMaterial(DefaultMaterial.NAME);
        }

        //-----------------------------------

        super(material);

        //-----------------------------------

        this._blendMode = BlendMode.NORMAL;
        this._texture = null;

        if (texture != null) {
            this.texture = texture;
        }
    }

    public alignPivot(horizontal:Align = Align.CENTER, vertical:Align = Align.CENTER):void {
        if (this._texture != null) {
            this._isMatrixValid = false;

            switch (horizontal) {
                case Align.RIGHT:
                    this._pivotX = this._texture.width;
                    break;

                case Align.CENTER:
                    this._pivotX = this._texture.width / 2;
                    break;

                case Align.LEFT:
                    this._pivotX = 0;
                    break;
            }

            switch (vertical) {
                case Align.BOTTOM:
                    this._pivotY = this._texture.height;
                    break;

                case Align.CENTER:
                    this._pivotY = this._texture.height / 2;
                    break;

                case Align.TOP:
                    this._pivotY = 0;
                    break;
            }
        }
    }

    public resetPivot():void {
        this.alignPivot(Align.LEFT, Align.TOP);
    }

    public render(render:Renderer):void {
        if (this._texture == null || this._visible === false) {
            return;
        }

        //-----------------------------------

        render.attachEntityState(this);
        render.attachMaterialWithTexture(this._material, this._texture, null, this._blendMode);
        render.attachIndexesData();

        //-----------------------------------

        TextureUtil.copyVertexData(
            render.createVertexesDataPointer(),
            this._material, this._texture.vertexData,
            render.state.matrix,
            render.state.alpha
        );

        //-----------------------------------

        render.detachEntityState();
    }

    public set blendMode(value:BlendMode) {
        this._blendMode = value;
    }

    public set texture(value:BaseTexture) {
        this._texture = value;
    }

    public set height(value:float) {
        this._scaleY = value / this._texture.height;
        this._isMatrixValid = false;
    }

    public set width(value:float) {
        this._scaleX = value / this._texture.width;
        this._isMatrixValid = false;
    }

    public get blendMode():BlendMode {
        return this._blendMode;
    }

    public get texture():BaseTexture {
        return this._texture;
    }

    public get height():float {
        return this._texture.height * this._scaleY;
    }

    public get width():float {
        return this._texture.width * this._scaleX;
    }
}
