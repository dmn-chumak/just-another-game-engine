import { Rectangle } from '../geometry/Rectangle';
import { BaseTexture } from './BaseTexture';
import { BlendFactor } from './BlendFactor';
import { BlendMode } from './BlendMode';
import { BufferUsage } from './BufferUsage';
import { Color } from './Color';
import { IndexBuffer } from './IndexBuffer';
import { Program } from './Program';
import { RenderTexture } from './RenderTexture';
import { ScalingTexture } from './ScalingTexture';
import { Shader } from './Shader';
import { ShaderType } from './ShaderType';
import { Texture } from './Texture';
import { VertexBuffer } from './VertexBuffer';

export class Context {
    protected static readonly POSSIBLE_CONTEXT_TYPE:Vector<string> = [
        'webgl2',
        'experimental-webgl2',
        'webgl',
        'experimental-webgl'
    ];

    protected _render:WebGLRenderingContext;
    protected _matrix:Float32Array;
    protected _canvas:HTMLCanvasElement;

    protected _blendMode:BlendMode;
    protected _renderTarget:RenderTexture;
    protected _viewport:Rectangle;

    public constructor(parent:HTMLElement) {
        this.createCanvasElement(parent);
        this.createRenderContext({
            premultipliedAlpha: false,
            alpha: false,
            powerPreference: 'high-performance',
            antialias: false,
            depth: false,
            stencil: false
        });
    }

    protected createCanvasElement(parent:HTMLElement):void {
        this._canvas = document.createElement('canvas');
        parent.appendChild(this._canvas);
    }

    protected createRenderContext(config:WebGLContextAttributes):void {
        for (const contextType of Context.POSSIBLE_CONTEXT_TYPE) {
            this._render = this._canvas.getContext(contextType, config) as WebGLRenderingContext;

            if (this._render != null) {
                console.log('WebGL context initialized with "' + contextType + '"!');
                break;
            }
        }

        //-----------------------------------

        if (this._render == null) {
            throw new Error('WebGL rendering context unsupported!');
        }

        //-----------------------------------

        this._blendMode = BlendMode.NONE;
        this._render.disable(this._render.STENCIL_TEST);
        this._render.disable(this._render.DEPTH_TEST);
        this._matrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        //-----------------------------------

        this.updateViewport(new Rectangle(
            0, 0, this._canvas.width,
            this._canvas.height
        ));
    }

    protected updateViewport(bounds:Rectangle, backBuffer:boolean = true):void {
        this._render.viewport(bounds.x, bounds.y, bounds.width, bounds.height);
        this.updateWorldMatrix3D(bounds.width, bounds.height, backBuffer);

        if (this._viewport !== bounds && backBuffer) {
            this._viewport = bounds.clone();
        }
    }

    protected updateWorldMatrix3D(width:int, height:int, backBuffer:boolean = true):void {
        const verticalDirection = backBuffer ? -1 : 1;

        this._matrix[0] = 2 / width;
        this._matrix[5] = 2 / height * verticalDirection;
        this._matrix[12] = -1;
        this._matrix[13] = -1 * verticalDirection;
    }

    protected resolveBlendFactor(blendFactor:BlendFactor):GLenum {
        if (blendFactor === BlendFactor.DESTINATION_ALPHA) {
            return this._render.DST_ALPHA;
        } else if (blendFactor === BlendFactor.DESTINATION_COLOR) {
            return this._render.DST_COLOR;
        } else if (blendFactor === BlendFactor.ONE) {
            return this._render.ONE;
        } else if (blendFactor === BlendFactor.ONE_MINUS_DESTINATION_ALPHA) {
            return this._render.ONE_MINUS_DST_ALPHA;
        } else if (blendFactor === BlendFactor.ONE_MINUS_DESTINATION_COLOR) {
            return this._render.ONE_MINUS_DST_COLOR;
        } else if (blendFactor === BlendFactor.ONE_MINUS_SOURCE_ALPHA) {
            return this._render.ONE_MINUS_SRC_ALPHA;
        } else if (blendFactor === BlendFactor.ONE_MINUS_SOURCE_COLOR) {
            return this._render.ONE_MINUS_SRC_COLOR;
        } else if (blendFactor === BlendFactor.SOURCE_ALPHA) {
            return this._render.SRC_ALPHA;
        } else if (blendFactor === BlendFactor.SOURCE_COLOR) {
            return this._render.SRC_COLOR;
        } else {
            return this._render.ZERO;
        }
    }

    public createProgram(fragmentSource:string, vertexSource:string):Program {
        const fragmentShader = this.createShader(ShaderType.FRAGMENT, fragmentSource);
        const vertexShader = this.createShader(ShaderType.VERTEX, vertexSource);
        return new Program(this._render, fragmentShader, vertexShader);
    }

    public createShader(shaderType:ShaderType, source:string):Shader {
        return new Shader(this._render, shaderType, source);
    }

    public createVertexBuffer(bufferUsage:BufferUsage = BufferUsage.DYNAMIC_DRAW):VertexBuffer {
        return new VertexBuffer(this._render, bufferUsage);
    }

    public createIndexBuffer(bufferUsage:BufferUsage = BufferUsage.DYNAMIC_DRAW):IndexBuffer {
        return new IndexBuffer(this._render, bufferUsage);
    }

    public createRenderTexture(width:int, height:int):RenderTexture {
        return new RenderTexture(this._render, width, height);
    }

    public createScalingTexture(parent:BaseTexture, region:Rectangle):ScalingTexture {
        return new ScalingTexture(this._render, parent, region);
    }

    public createTexture():Texture {
        return new Texture(this._render);
    }

    public selectBlendMode(blendMode:BlendMode):void {
        if (this._blendMode === blendMode) {
            return;
        }

        this._render.enable(this._render.BLEND);
        this._render.blendEquation(this._render.FUNC_ADD);
        this._blendMode = blendMode;

        if (blendMode === BlendMode.NONE) {
            this._render.blendFunc(this._render.ONE, this._render.ZERO);
        } else if (blendMode === BlendMode.ADD) {
            this._render.blendFunc(this._render.ONE, this._render.ONE);
        } else if (blendMode === BlendMode.MULTIPLY) {
            this._render.blendFunc(this._render.DST_COLOR, this._render.ONE_MINUS_SRC_ALPHA);
        } else if (blendMode === BlendMode.SCREEN) {
            this._render.blendFunc(this._render.ONE, this._render.ONE_MINUS_SRC_COLOR);
        } else if (blendMode === BlendMode.PARTICLE) {
            this._render.blendFuncSeparate(
                this._render.SRC_ALPHA,
                this._render.ONE_MINUS_SRC_ALPHA,
                this._render.DST_ALPHA,
                this._render.ONE_MINUS_SRC_ALPHA
            );
        } else {
            this._render.blendFuncSeparate(
                this._render.SRC_ALPHA,
                this._render.ONE_MINUS_SRC_ALPHA,
                this._render.ONE,
                this._render.ONE_MINUS_SRC_ALPHA
            );
        }
    }

    public renderToBackBuffer():void {
        this._render.bindFramebuffer(this._render.FRAMEBUFFER, null);
        this.updateViewport(this._viewport);
        this._renderTarget = null;
    }

    public renderToTexture(texture:RenderTexture):void {
        this._render.bindFramebuffer(this._render.FRAMEBUFFER, texture.native);
        this.updateViewport(texture.bounds, false);
        this._renderTarget = texture;
    }

    public selectProgram(program:Program):void {
        this._render.useProgram(program.native);
    }

    public renderTriangles(indexBuffer:IndexBuffer, numIndices:int):void {
        this._render.bindBuffer(this._render.ELEMENT_ARRAY_BUFFER, indexBuffer.native);
        this._render.drawElements(this._render.TRIANGLES, numIndices, this._render.UNSIGNED_SHORT, 0);
    }

    public clear(color:Color, alpha:float = 1.0):void {
        this._render.clearColor(color.r, color.g, color.b, alpha);
        this._render.clear(this._render.COLOR_BUFFER_BIT);
    }

    public set viewport(value:Rectangle) {
        this.updateViewport(value);
    }

    public get viewport():Rectangle {
        return this._viewport;
    }

    public get parent():HTMLCanvasElement {
        return this._canvas;
    }

    public get native():WebGLRenderingContext {
        return this._render;
    }

    public get matrix():Float32Array {
        return this._matrix;
    }
}
