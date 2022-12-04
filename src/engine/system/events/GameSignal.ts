import { GameEventListener } from './GameEventListener';

export class GameSignal<Type> {
    private _listeners:Vector<GameEventListener<Type>>;
    private _redirects:Vector<GameSignal<Type>>;

    public constructor() {
        this._listeners = [];
        this._redirects = [];
    }

    public appendListener(listener:GameEventListener<Type>):void {
        const length = this._listeners.length;

        for (let index = 0; index < length; index++) {
            const current = this._listeners[index];
            if (current === listener) {
                return;
            }
        }

        this._listeners[length] = listener;
    }

    public removeAllListeners():void {
        this._listeners = [];
    }

    public removeListener(listener:GameEventListener<Type>):void {
        const length = this._listeners.length;

        for (let index = 0; index < length; index++) {
            const current = this._listeners[index];
            if (current === listener) {
                this._listeners.splice(index, 1);
                return;
            }
        }
    }

    public appendRedirect(signal:GameSignal<Type>):void {
        const index = this._redirects.indexOf(signal);
        if (index === -1) {
            const length = this._redirects.length;
            this._redirects[length] = signal;
        }
    }

    public removeAllRedirects():void {
        this._listeners = [];
    }

    public removeRedirect(signal:GameSignal<Type>):void {
        const index = this._redirects.indexOf(signal);
        if (index !== -1) {
            this._redirects.splice(index, 1);
        }
    }

    public notify(value:Type):void {
        this._listeners.forEach(
            (handler) => {
                handler(value);
            }
        );

        this._redirects.forEach(
            (handler) => {
                handler.notify(value);
            }
        );
    }
}
