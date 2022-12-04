import { Point } from '../geometry/Point';
import { DisplayContainer } from './DisplayContainer';

export class Stage extends DisplayContainer {
    private _stageHeight:int;
    private _stageWidth:int;

    public constructor() {
        super();

        this._stageHeight = 0;
        this._stageWidth = 0;
    }

    public validate(deviceSize:Point):void {
        this._stageHeight = deviceSize.y;
        this._stageWidth = deviceSize.x;
    }

    public get stageHeight():int {
        return this._stageHeight;
    }

    public get stageWidth():int {
        return this._stageWidth;
    }
}
