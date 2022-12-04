import { GameEventDispatcher } from './GameEventDispatcher';

export class GameEvent {
    private _stopsImmediatePropagation:boolean;
    private _stopsPropagation:boolean;

    private _currentTarget:GameEventDispatcher;
    private _target:GameEventDispatcher;
    private _bubbles:boolean;
    private _type:string;

    public constructor(type:string, bubbles:boolean = false) {
        this._stopsImmediatePropagation = false;
        this._stopsPropagation = false;

        this._currentTarget = null;
        this._target = null;
        this._bubbles = bubbles;
        this._type = type;
    }

    public stopImmediatePropagation():void {
        this._stopsImmediatePropagation = true;
    }

    public stopPropagation():void {
        this._stopsPropagation = true;
    }

    public set currentTarget(value:GameEventDispatcher) {
        this._currentTarget = value;
    }

    public set target(value:GameEventDispatcher) {
        this._target = value;
    }

    public get stopsImmediatePropagation():boolean {
        return this._stopsImmediatePropagation;
    }

    public get stopsPropagation():boolean {
        return this._stopsPropagation;
    }

    public get currentTarget():GameEventDispatcher {
        return this._currentTarget;
    }

    public get bubbles():boolean {
        return this._bubbles;
    }

    public get target():GameEventDispatcher {
        return this._target;
    }

    public get type():string {
        return this._type;
    }
}
