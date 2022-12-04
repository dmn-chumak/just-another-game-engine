export abstract class ContextResource<Type> {
    protected readonly _render:WebGLRenderingContext;
    protected _native:Type;

    protected constructor(render:WebGLRenderingContext) {
        this._render = render;
    }

    public get native():Type {
        return this._native;
    }

    public compose():void {
        // empty
    }

    public dispose():void {
        // empty
    }
}
