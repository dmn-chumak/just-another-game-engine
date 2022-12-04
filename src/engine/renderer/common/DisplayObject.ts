import { Matrix } from '../geometry/Matrix';
import { Material } from '../materials/Material';
import { Renderer } from '../Renderer';
import { DisplayContainer } from './DisplayContainer';

export class DisplayObject {
    protected _isMatrixValid:boolean;

    protected _material:Material;
    protected _parent:DisplayContainer;
    protected _visible:boolean;
    protected _matrix:Matrix;

    protected _rotation:float;
    protected _scaleX:float;
    protected _scaleY:float;
    protected _pivotX:float;
    protected _pivotY:float;
    protected _alpha:float;
    protected _x:float;
    protected _y:float;

    public constructor(material:Material = null) {
        this._isMatrixValid = true;

        this._material = material;
        this._matrix = new Matrix();
        this._visible = true;
        this._parent = null;

        this._rotation = 0;
        this._scaleX = 1.0;
        this._scaleY = 1.0;
        this._pivotX = 0;
        this._pivotY = 0;
        this._alpha = 1.0;
        this._x = 0;
        this._y = 0;
    }

    public removeFromParent():void {
        if (this._parent != null) {
            this._parent.removeChild(this);
        }
    }

    public render(render:Renderer):void {
        // empty
    }

    public update(offset:float):void {
        // empty
    }

    public set visible(value:boolean) {
        this._visible = value;
    }

    public set rotation(value:float) {
        this._isMatrixValid = false;
        this._rotation = value;
    }

    public set parent(value:DisplayContainer) {
        this._parent = value;
    }

    public set material(value:Material) {
        this._material = value;
    }

    public set matrix(value:Matrix) {
        // TODO: validate all fields by matrix (x, y, rotation)
        this._isMatrixValid = true;
        this._matrix = value;
    }

    public set pivotX(value:float) {
        this._isMatrixValid = false;
        this._pivotX = value;
    }

    public set pivotY(value:float) {
        this._isMatrixValid = false;
        this._pivotY = value;
    }

    public set scaleX(value:float) {
        this._isMatrixValid = false;
        this._scaleX = value;
    }

    public set scaleY(value:float) {
        this._isMatrixValid = false;
        this._scaleY = value;
    }

    public set height(value:float) {
        // empty
    }

    public set width(value:float) {
        // empty
    }

    public set scale(value:float) {
        this._isMatrixValid = false;
        this._scaleX = this._scaleY = value;
    }

    public set alpha(value:float) {
        this._alpha = value;
    }

    public set x(value:float) {
        this._isMatrixValid = false;
        this._x = value;
    }

    public set y(value:float) {
        this._isMatrixValid = false;
        this._y = value;
    }

    public get visible():boolean {
        return this._visible;
    }

    public get rotation():float {
        return this._rotation;
    }

    public get parent():DisplayContainer {
        return this._parent;
    }

    public get material():Material {
        return this._material;
    }

    public get matrix():Matrix {
        if (this._isMatrixValid === true) {
            return this._matrix;
        }

        if (this._rotation === 0) {
            this._matrix.a = this._scaleX;
            this._matrix.b = 0;
            this._matrix.c = 0;
            this._matrix.d = this._scaleY;

            this._matrix.x = this._x - this._pivotX * this._scaleX;
            this._matrix.y = this._y - this._pivotY * this._scaleY;
        } else {
            const cos = Math.cos(this._rotation);
            const sin = Math.sin(this._rotation);

            const a = this._scaleX * cos;
            const b = this._scaleX * sin;
            const c = this._scaleY * -sin;
            const d = this._scaleY * cos;

            const x = this._x - this._pivotX * a - this._pivotY * c;
            const y = this._y - this._pivotX * b - this._pivotY * d;

            this._matrix.a = a;
            this._matrix.b = b;
            this._matrix.c = c;
            this._matrix.d = d;

            this._matrix.x = x;
            this._matrix.y = y;
        }

        this._isMatrixValid = true;
        return this._matrix;
    }

    public get pivotX():float {
        return this._pivotX;
    }

    public get pivotY():float {
        return this._pivotY;
    }

    public get scaleX():float {
        return this._scaleX;
    }

    public get scaleY():float {
        return this._scaleY;
    }

    public get height():float {
        return 0;
    }

    public get width():float {
        return 0;
    }

    public get alpha():float {
        return this._alpha;
    }

    public get x():float {
        return this._x;
    }

    public get y():float {
        return this._y;
    }
}
