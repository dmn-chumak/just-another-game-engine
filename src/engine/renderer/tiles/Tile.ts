import { BaseTexture } from '../context/BaseTexture';

export class Tile {
    public texture:BaseTexture;
    public x:int;
    public y:int;

    public constructor(x:int = 0, y:int = 0) {
        this.texture = null;
        this.x = x;
        this.y = y;
    }
}
