import { ByteArray } from '../../utils/ByteArray';
import { Rectangle } from '../geometry/Rectangle';
import { BaseTexture } from './BaseTexture';
import { Texture } from './Texture';

export class TextureAtlas {
    private readonly _regions:Dictionary<BaseTexture>;
    private readonly _texture:Texture;

    public constructor(texture:Texture, description:ArrayBuffer = null) {
        this._texture = texture;
        this._regions = {};

        if (description != null) {
            const source = new ByteArray(description);
            const regionsCount = source.readInt();

            for (let index = 0; index < regionsCount; index++) {
                const name = source.readUTF();

                const region = new Rectangle(
                    source.readInt(),
                    source.readInt(),
                    source.readInt(),
                    source.readInt()
                );

                this.createTexture(
                    name, region
                );
            }
        }
    }

    public createTexture(name:string, region:Rectangle):BaseTexture {
        const texture = this._texture.createSubTexture(region);
        this._regions[name] = texture;
        return texture;
    }

    public obtainTexture(name:string):BaseTexture {
        return this._regions[name];
    }

    public get texture():BaseTexture {
        return this._texture;
    }
}
