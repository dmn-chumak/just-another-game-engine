import { Material } from '../materials/Material';
import { Renderer } from '../Renderer';
import { DisplayObject } from './DisplayObject';

export class DisplayContainer extends DisplayObject {
    protected readonly _children:Vector<DisplayObject>;

    public constructor(material:Material = null) {
        super(material);
        this._children = [];
    }

    protected renderChildrenList(render:Renderer):void {
        for (const child of this._children) {
            child.render(render);
        }
    }

    public appendChildAt(object:DisplayObject, index:int):void {
        if (object != null && object.parent == null) {
            this._children.splice(index, 0, object);
            object.parent = this;
        }
    }

    public appendChildren(objectsList:DisplayObject[]):void {
        for (const object of objectsList) {
            this.appendChild(object);
        }
    }

    public appendChild(object:DisplayObject):void {
        if (object != null && object.parent == null) {
            this._children.push(object);
            object.parent = this;
        }
    }

    public removeChild(object:DisplayObject):void {
        if (object != null && object.parent == this) {
            this._children.splice(this._children.indexOf(object), 1);
            object.parent = null;
        }
    }

    public removeChildren():void {
        while (this._children.length > 0) {
            this.removeChild(this._children[0]);
        }
    }

    public render(render:Renderer):void {
        if (this._visible) {
            render.attachEntityState(this);
            this.renderChildrenList(render);
            render.detachEntityState();
        }
    }

    public update(offset:float):void {
        for (const child of this._children) {
            child.update(offset);
        }
    }

    public get children():Vector<DisplayObject> {
        return this._children;
    }
}
