import { GameEvent } from './GameEvent';
import { GameEventListener } from './GameEventListener';

export class GameEventDispatcher {
    private _eventListeners:Dictionary<Vector<GameEventListener<GameEvent>>>;
    private _eventStack:Vector<string>;

    public constructor() {
        this._eventListeners = {};
        this._eventStack = [];
    }

    protected buildEventChain():Vector<GameEventDispatcher> {
        return [ this ];
    }

    protected invokeEvent(event:GameEvent):boolean {
        if (this._eventListeners[event.type] == null) {
            return false;
        }

        const listeners = this._eventListeners[event.type];
        const length = listeners.length;

        //-----------------------------------

        this._eventStack[this._eventStack.length] = event.type;
        event.currentTarget = this;

        for (let index = 0; index < length; index++) {
            const current = listeners[index];
            current(event);

            if (event.stopsImmediatePropagation) {
                this._eventStack.pop();
                return true;
            }
        }

        this._eventStack.pop();

        //-----------------------------------

        return event.stopsPropagation;
    }

    protected bubbleEvent(event:GameEvent):boolean {
        const listeners = this.buildEventChain();
        const length = listeners.length;

        for (let index = 0; index < length; index++) {
            const stopsPropagation = listeners[index].invokeEvent(event);
            if (stopsPropagation) {
                return true;
            }
        }

        return false;
    }

    public appendEventListener(type:string, listener:GameEventListener<GameEvent>):void {
        if (this._eventListeners[type] == null) {
            this._eventListeners[type] = [ listener ];
            return;
        }

        const listeners = this._eventListeners[type];
        const length = listeners.length;

        for (let index = 0; index < length; index++) {
            const current = listeners[index];
            if (current === listener) {
                return;
            }
        }

        listeners[length] = listener;
    }

    public removeEventListener(type:string, listener:GameEventListener<GameEvent>):void {
        if (this._eventListeners[type] == null) {
            return;
        }

        const listeners = this._eventListeners[type];
        const length = listeners.length;

        for (let index = 0; index < length; index++) {
            const current = listeners[index];
            if (current === listener) {
                if (this._eventStack.indexOf(type) !== -1) {
                    const listenersClone = listeners.concat();
                    listenersClone.splice(index, 1);
                    this._eventListeners[type] = listenersClone;
                } else {
                    listeners.splice(index, 1);
                }

                break;
            }
        }
    }

    public containsEventListener(type:string, listener:GameEventListener<GameEvent> = null):boolean {
        const listeners = this._eventListeners[type];

        if (listeners != null) {
            const length = listeners.length;

            if (listener != null) {
                for (let index = 0; index < length; index++) {
                    const current = listeners[index];
                    if (current === listener) {
                        return true;
                    }
                }
            } else {
                return length > 0;
            }
        }

        return false;
    }

    public removeEventListeners(type:string = null):void {
        if (type !== null) {
            this._eventListeners[type] = [];
        } else {
            this._eventListeners = {};
        }
    }

    public dispatchEvent(event:GameEvent):void {
        const prev = event.target;
        event.target = this;

        //-----------------------------------

        if (event.bubbles) {
            this.bubbleEvent(event);
        } else {
            this.invokeEvent(event);
        }

        //-----------------------------------

        event.target = prev;
    }
}
