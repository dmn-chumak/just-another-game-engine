import { ByteArray } from '../../utils/ByteArray';
import { BaseTexture } from '../context/BaseTexture';
import { Rectangle } from '../geometry/Rectangle';

export class BitmapChar {
    private readonly _texture:BaseTexture;
    private readonly _advanceX:float;
    private readonly _offsetX:float;
    private readonly _offsetY:float;

    public constructor(texture:BaseTexture, description:ByteArray) {
        this._advanceX = description.readByte();
        this._offsetX = description.readByte();
        this._offsetY = description.readByte();

        this._texture = texture.createSubTexture(
            new Rectangle(
                description.readShort(),
                description.readShort(),
                description.readByte(),
                description.readByte()
            )
        );
    }

    public get texture():BaseTexture {
        return this._texture;
    }

    public get advanceX():float {
        return this._advanceX;
    }

    public get offsetX():float {
        return this._offsetX;
    }

    public get offsetY():float {
        return this._offsetY;
    }
}
