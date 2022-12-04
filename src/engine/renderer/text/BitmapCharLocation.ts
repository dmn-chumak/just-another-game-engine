import { BitmapChar } from './BitmapChar';

export class BitmapCharLocation {
    private readonly _char:BitmapChar;
    private readonly _x:float;
    private readonly _y:float;

    public constructor(char:BitmapChar, x:float, y:float) {
        this._char = char;
        this._x = x;
        this._y = y;
    }

    public get char():BitmapChar {
        return this._char;
    }

    public get x():float {
        return this._x;
    }

    public get y():float {
        return this._y;
    }
}
