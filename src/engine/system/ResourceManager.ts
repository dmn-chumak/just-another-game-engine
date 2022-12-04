import { BaseTexture } from '../renderer/context/BaseTexture';
import { Texture } from '../renderer/context/Texture';
import { TextureAtlas } from '../renderer/context/TextureAtlas';
import { Material } from '../renderer/materials/Material';
import { MaterialClass } from '../renderer/materials/MaterialClass';
import { BitmapFont } from '../renderer/text/BitmapFont';
import { ByteArray } from '../utils/ByteArray';

export class ResourceManager {
    private static _instance:ResourceManager;

    private readonly _materials:Dictionary<Material>;
    private readonly _textureAtlases:Dictionary<TextureAtlas>;
    private readonly _textures:Dictionary<BaseTexture>;
    private readonly _bitmapFonts:Dictionary<BitmapFont>;
    private readonly _binaryFiles:Dictionary<ArrayBuffer>;
    private readonly _jsonFiles:Dictionary<any>;

    public constructor() {
        if (ResourceManager._instance == null) {
            ResourceManager._instance = this;
        }

        this._materials = {};
        this._textureAtlases = {};
        this._textures = {};
        this._bitmapFonts = {};
        this._binaryFiles = {};
        this._jsonFiles = {};
    }

    //-----------------------------------

    public static obtainMaterial(name:string):Material {
        return this._instance.materials[name];
    }

    public static obtainTextureAtlas(name:string):TextureAtlas {
        return this._instance.textureAtlases[name];
    }

    public static obtainTexture(name:string):BaseTexture {
        const [ atlas, texture ] = name.split('/');

        if (texture != null) {
            const textureAtlas = this._instance.textureAtlases[atlas];
            if (textureAtlas != null) {
                return textureAtlas.obtainTexture(texture);
            }
        }

        return null;
    }

    public static obtainBitmapFont(name:string):BitmapFont {
        return this._instance.bitmapFonts[name];
    }

    public static obtainBinaryFile(name:string):ByteArray {
        const binaryFile = this._instance.binaryFiles[name];

        if (binaryFile != null) {
            return new ByteArray(binaryFile);
        }

        return null;
    }

    public static obtainJsonFile(name:string):any {
        return this._instance.jsonFiles[name];
    }

    //-----------------------------------

    public registerBitmapFont(name:string, texture:Texture, description:ArrayBuffer):void {
        this._bitmapFonts[name] = new BitmapFont(texture, description);
    }

    public registerTextureAtlas(name:string, texture:Texture, description:ArrayBuffer):void {
        this._textureAtlases[name] = new TextureAtlas(texture, description);
    }

    public registerMaterial(material:MaterialClass<Material>):void {
        this._materials[material.NAME] = new material();
    }

    //-----------------------------------

    public static get instance():ResourceManager {
        return this._instance;
    }

    //-----------------------------------

    public get materials():Dictionary<Material> {
        return this._materials;
    }

    public get textureAtlases():Dictionary<TextureAtlas> {
        return this._textureAtlases;
    }

    public get textures():Dictionary<BaseTexture> {
        return this._textures;
    }

    public get bitmapFonts():Dictionary<BitmapFont> {
        return this._bitmapFonts;
    }

    public get binaryFiles():Dictionary<ArrayBuffer> {
        return this._binaryFiles;
    }

    public get jsonFiles():Dictionary<any> {
        return this._jsonFiles;
    }
}
