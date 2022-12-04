import { BaseTexture } from '../context/BaseTexture';

export class Particle {
    public rotation:int;
    public texture:BaseTexture;
    public x:int;
    public y:int;

    public constructor(x:int = 0, y:int = 0, rotation:int = 0) {
        this.rotation = rotation;
        this.texture = null;
        this.x = x;
        this.y = y;
    }
}
