import { NumberUtil } from '../../utils/NumberUtil';
import { Point } from './Point';

export class Matrix {
    public static readonly IDENTITY:Matrix = new Matrix();

    private readonly _data:Float32Array;

    public constructor(a:float = 1, b:float = 0, c:float = 0, d:float = 1, x:float = 0, y:float = 0) {
        // initializing data bypassing adjust method for better performance

        this._data = new Float32Array([
            a, b, x, // a - b | x
            c, d, y  // c - d | y
        ]);
    }

    public adjust(a:float, b:float, c:float, d:float, x:float, y:float):void {
        this.x = x;
        this.y = y;

        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    public static transform(matrix:Matrix, point:Point):Point {
        return new Point(
            Matrix.transformAxisX(matrix, point.x, point.y),
            Matrix.transformAxisY(matrix, point.x, point.y)
        );
    }

    public static transformAxisX(matrix:Matrix, x:float, y:float):float {
        // providing access to raw data indices for better performance
        return x * matrix._data[0] + y * matrix._data[3] + matrix._data[2];
    }

    public static transformAxisY(matrix:Matrix, x:float, y:float):float {
        // providing access to raw data indices for better performance
        return x * matrix._data[1] + y * matrix._data[4] + matrix._data[5];
    }

    public static concat(base:Matrix, next:Matrix):Matrix {
        // providing access to raw data indices for better performance

        const baseA = base._data[0];
        const baseB = base._data[1];
        const baseC = base._data[3];
        const baseD = base._data[4];
        const baseX = base._data[2];
        const baseY = base._data[5];

        const nextA = next._data[0];
        const nextB = next._data[1];
        const nextC = next._data[3];
        const nextD = next._data[4];
        const nextX = next._data[2];
        const nextY = next._data[5];

        return new Matrix(
            baseA * nextA + baseC * nextB,
            baseB * nextA + baseD * nextB,
            baseA * nextC + baseC * nextD,
            baseB * nextC + baseD * nextD,
            baseX + baseA * nextX + baseC * nextY,
            baseY + baseB * nextX + baseD * nextY
        );
    }

    public identity():void {
        this.adjust(1, 0, 0, 1, 0, 0);
    }

    public rotate(angle:float):void {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        this.adjust(
            this.a * cos - this.b * sin,
            this.a * sin + this.b * cos,
            this.c * cos - this.d * sin,
            this.c * sin + this.d * cos,
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    public translate(offsetX:float, offsetY:float):void {
        this.x += offsetX;
        this.y += offsetY;
    }

    public scale(scaleX:float, scaleY:float):void {
        this.x *= scaleX;
        this.y *= scaleY;

        this.a *= scaleX;
        this.c *= scaleX;
        this.b *= scaleY;
        this.d *= scaleY;
    }

    public equals(matrix:Matrix):boolean {
        return (
            NumberUtil.equals(this.x, matrix.x) &&
            NumberUtil.equals(this.y, matrix.y) &&
            NumberUtil.equals(this.a, matrix.a) &&
            NumberUtil.equals(this.b, matrix.b) &&
            NumberUtil.equals(this.c, matrix.c) &&
            NumberUtil.equals(this.d, matrix.d)
        );
    }

    public clone():Matrix {
        return new Matrix(
            this.a, this.b, this.c, this.d,
            this.x, this.y
        );
    }

    public set x(value:float) {
        this._data[2] = value;
    }

    public set y(value:float) {
        this._data[5] = value;
    }

    public set a(value:float) {
        this._data[0] = value;
    }

    public set b(value:float) {
        this._data[1] = value;
    }

    public set c(value:float) {
        this._data[3] = value;
    }

    public set d(value:float) {
        this._data[4] = value;
    }

    public get x():float {
        return this._data[2];
    }

    public get y():float {
        return this._data[5];
    }

    public get a():float {
        return this._data[0];
    }

    public get b():float {
        return this._data[1];
    }

    public get c():float {
        return this._data[3];
    }

    public get d():float {
        return this._data[4];
    }
}
