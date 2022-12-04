
export class Color {
    public static readonly BLACK:Color  = new Color(0x000000);
    public static readonly GREY:Color   = new Color(0xD4D4D4);
    public static readonly WHITE:Color  = new Color(0xFFFFFF);

    public static readonly RED:Color    = new Color(0xFF0000);
    public static readonly GREEN:Color  = new Color(0x00FF00);
    public static readonly BLUE:Color   = new Color(0x0000FF);

    private _color:int;
    private _r:float;
    private _g:float;
    private _b:float;

    public constructor(color:int) {
        this.color = color;
    }

    public static createFloatArray(color:int):Float32Array {
        return new Float32Array(this.createArray(color));
    }

    public static createArray(color:int):Vector<float> {
        return new Color(color).array;
    }

    public static create(color:int):Color {
        return new Color(color);
    }

    public set color(value:int) {
        this._color = value;
        this._r = (value >> 16 & 0xFF) / 0xFF;
        this._g = (value >> 8 & 0xFF) / 0xFF;
        this._b = (value & 0xFF) / 0xFF;
    }

    public set r(value:float) {
        this._color = (this._color & 0x00FFFF) | ((value * 0xFF) << 16);
        this._r = value;
    }

    public set g(value:float) {
        this._color = (this._color & 0xFF00FF) | ((value * 0xFF) << 8);
        this._g = value;
    }

    public set b(value:float) {
        this._color = (this._color & 0xFFFF00) | (value * 0xFF);
        this._b = value;
    }

    public get array():Vector<float> {
        return [ this._r, this._g, this._b, 1.0 ];
    }

    public get color():int {
        return this._color;
    }

    public get r():float {
        return this._r;
    }

    public get g():float {
        return this._g;
    }

    public get b():float {
        return this._b;
    }
}
