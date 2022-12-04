import { ByteArray } from '../../utils/ByteArray';
import { BaseTexture } from '../context/BaseTexture';
import { BitmapChar } from './BitmapChar';

export class BitmapFont {
    private readonly _charsMap:Dictionary<BitmapChar>;
    private readonly _texture:BaseTexture;

    private readonly _baseLine:int;
    private readonly _lineHeight:int;
    private readonly _size:int;

    public constructor(texture:BaseTexture, description:ArrayBuffer) {
        const source = new ByteArray(description);

        //-----------------------------------

        this._texture = texture;
        this._baseLine = source.readByte();
        this._lineHeight = source.readByte();
        this._size = source.readByte();
        this._charsMap = {};

        //-----------------------------------

        const charsCount = source.readShort();

        for (let index = 0; index < charsCount; index++) {
            const bitmapCharIndex = source.readShort();
            const bitmapChar = new BitmapChar(texture, source);
            this._charsMap[bitmapCharIndex] = bitmapChar;
        }
    }

    public get charsMap():Dictionary<BitmapChar> {
        return this._charsMap;
    }

    public get texture():BaseTexture {
        return this._texture;
    }

    public get baseLine():int {
        return this._baseLine;
    }

    public get lineHeight():int {
        return this._lineHeight;
    }

    public get size():int {
        return this._size;
    }
}
