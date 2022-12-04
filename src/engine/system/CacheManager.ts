import { Cacheable } from './Cacheable';

export class CacheManager {
    private _cache:Vector<Vector<Cacheable>>;
    private _index:int;

    public constructor() {
        this._cache = [];
        this._index = 0;
    }

    public create(type:any):void {
        type.index = this._index;
        this._cache[type.index] = [];
        this._index++;
    }

    public obtain(type:any, ...args:Vector<any>):any {
        const items = this._cache[type.index];

        if (items.length === 0) {
            return new type(...args);
        }

        return items.pop();
    }

    public append(item:any):void {
        const type = Object.getPrototypeOf(item).constructor;
        this._cache[type.index].push(item);
    }

    public remove(type:any):void {
        this._cache[type.index] = [];
    }
}
