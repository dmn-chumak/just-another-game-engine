import { DisplayObject } from './common/DisplayObject';
import { Stage } from './common/Stage';
import { BaseTexture } from './context/BaseTexture';
import { BlendMode } from './context/BlendMode';
import { Color } from './context/Color';
import { Context } from './context/Context';
import { IndexBuffer } from './context/IndexBuffer';
import { RenderTexture } from './context/RenderTexture';
import { TextureUtil } from './context/TextureUtil';
import { VertexBuffer } from './context/VertexBuffer';
import { Matrix } from './geometry/Matrix';
import { Rectangle } from './geometry/Rectangle';
import { Material } from './materials/Material';
import { RenderEntityState } from './RenderEntityState';
import { RenderState } from './RenderState';
import { RenderStatsView } from './RenderStatsView';
import { increaseVertexes } from './Vector';
import { QUAD_VTX_COUNT } from './Vector';
import { generateIndices } from './Vector';
import { increaseIndices } from './Vector';
import { QUAD_IDX_COUNT } from './Vector';

export class Renderer extends Context {
    private static readonly AVERAGE_TIME_LIMIT:int = 50;

    private readonly _state:RenderState;
    private readonly _statsView:RenderStatsView;
    private readonly _stage:Stage;

    private _frameEntityCount:int;
    private _frameDrawCallsCount:int;
    private _frameParticlesCount:int;
    private _frameAverageRenderTime:Vector<int>;
    private _frameRenderTime:int;
    private _frameAverageUpdateTime:Vector<int>;
    private _frameUpdateTime:int;

    private _stageVertexData:Vector<float>;
    private _vertexVector:ArrayBuffer;
    private _vertexBuffer:VertexBuffer;
    private _vertexNumber:int;

    private _indexVector:ArrayBuffer;
    private _indexBuffer:IndexBuffer;
    private _indexNumber:int;

    public constructor(parent:HTMLElement) {
        super(parent);

        this._frameAverageRenderTime = [];
        this._frameAverageUpdateTime = [];
        this._frameEntityCount = 0;
        this._frameDrawCallsCount = 0;
        this._frameParticlesCount = 0;
        this._frameRenderTime = 0;
        this._frameUpdateTime = 0;

        this._state = new RenderState();
        this._statsView = new RenderStatsView();
        this._stage = new Stage();

        this._vertexVector = new ArrayBuffer(64);
        this._vertexBuffer = this.createVertexBuffer();
        this._vertexNumber = 0;

        this._indexVector = new ArrayBuffer(64);
        this._indexBuffer = this.createIndexBuffer();
        this._indexNumber = 0;

        this.validate();
    }

    protected prepareVertexes():void {
        this._vertexNumber = 0;
        this._indexNumber = 0;
    }

    protected processVertexes():void {
        if (this._vertexNumber === 0) {
            return;
        }

        //-----------------------------------

        if (this._state.material !== this._state.previousMaterial) {
            this._state.previousMaterial = this._state.material;
            this._state.material.applyProgram(this);
            this._state.material.applyProgramAttributes();
        }

        this._state.material.applyProgramUniforms(
            this._state.textures, {
                [Material.WORLD_MATRIX_UNIFORM]: this._matrix,
                ...this._state.uniformsData
            }
        );

        this._frameDrawCallsCount++;

        //-----------------------------------

        this._vertexBuffer.uploadBuffer(
            new Float32Array(
                this._vertexVector, 0,
                this._vertexNumber * this._state.material.strideElements
            )
        );

        //-----------------------------------

        this._indexBuffer.uploadBuffer(
            new Uint16Array(
                this._indexVector, 0,
                this._indexNumber
            )
        );

        //-----------------------------------

        this.selectBlendMode(this._state.blendMode);
        this.renderTriangles(
            this._indexBuffer,
            this._indexNumber
        );
    }

    public attachEntityState(object:DisplayObject):void {
        this._state.attachEntityState(object.matrix, object.alpha);
        this._frameEntityCount++;
    }

    public attachAbstractEntityState(matrix:Matrix, alpha:float = 1):void {
        this._state.attachEntityState(matrix, alpha);
        this._frameEntityCount++;
    }

    public detachEntityState():void {
        this._state.detachEntityState();
    }

    public attachMaterialWithTexture(material:Material, texture:BaseTexture, uniformsData:Dictionary<Float32Array> = null, blendMode:BlendMode = BlendMode.NORMAL):void {
        if (
               this._state.isMaterialChanged(material)
            || this._state.isUniformsDataChanged(uniformsData)
            || this._state.isTextureChanged(texture)
            || this._state.isBlendModeChanged(blendMode)
        ) {
            this.processVertexes();

            //-----------------------------------

            this._state.material = material;
            this._state.uniformsData = uniformsData;
            this._state.textures = [ texture ];
            this._state.blendMode = blendMode;

            //-----------------------------------

            this.prepareVertexes();
        }
    }

    public attachMaterialWithTextures(material:Material, textures:Vector<BaseTexture>, uniformsData:Dictionary<Float32Array> = null, blendMode:BlendMode = BlendMode.NORMAL):void {
        if (
               this._state.isMaterialChanged(material)
            || this._state.isUniformsDataChanged(uniformsData)
            || this._state.isTexturesChanged(textures)
            || this._state.isBlendModeChanged(blendMode)
        ) {
            this.processVertexes();

            //-----------------------------------

            this._state.material = material;
            this._state.uniformsData = uniformsData;
            this._state.textures = textures;
            this._state.blendMode = blendMode;

            //-----------------------------------

            this.prepareVertexes();
        }
    }

    public attachParticlesCount(count:int):void {
        this._frameParticlesCount += count;
    }

    public attachTextureVertexes(texture:BaseTexture = null):void {
        this.attachIndexesData();

        TextureUtil.copyVertexData(
            this.createVertexesDataPointer(),
            this._state.material, texture.vertexData,
            Matrix.IDENTITY, 1.0
        );
    }

    public attachBackBufferVertexes():void {
        if (this._renderTarget != null) {
            this.attachTextureVertexes(this._renderTarget.target);
        } else {
            this.attachIndexesData();

            TextureUtil.copyVertexData(
                this.createVertexesDataPointer(),
                this._state.material, this._stageVertexData,
                Matrix.IDENTITY, 1.0
            );
        }
    }

    public attachIndexesData(indexCount:int = QUAD_IDX_COUNT, indexesData:ArrayLike<int> = null):void {
        const indexEnsure = this._indexNumber + indexCount;
        const indexBuffer = increaseIndices(this._indexVector, indexEnsure);
        const indexVector = new Uint16Array(indexBuffer);

        //-----------------------------------

        if (indexesData != null) {
            for (let index = 0; index < indexCount; index++) {
                indexVector[this._indexNumber + index] = indexesData[index] + this._vertexNumber;
            }
        } else {
            generateIndices(
                indexVector,
                this._indexNumber,
                indexEnsure,
                this._vertexNumber
            );
        }

        //-----------------------------------

        this._indexVector = indexBuffer;
        this._indexNumber = indexEnsure;
    }

    public createVertexesDataPointer(vertexCount:int = QUAD_VTX_COUNT):Float32Array {
        const vertexStride = this._state.material.stride;
        const vertexEnsure = (this._vertexNumber + vertexCount) * vertexStride / VertexBuffer.ELEMENT_SIZE;
        const vertexOffset = this._vertexNumber * vertexStride;

        //-----------------------------------

        this._vertexVector = increaseVertexes(this._vertexVector, vertexEnsure);
        this._vertexNumber += vertexCount;

        //-----------------------------------

        return new Float32Array(
            this._vertexVector,
            vertexOffset
        );
    }

    public createStageRenderTexture():RenderTexture {
        return this.createRenderTexture(this._stage.stageWidth, this._stage.stageHeight);
    }

    public renderToTexture(texture:RenderTexture):void {
        if (this._renderTarget !== texture) {
            this.processVertexes();
            super.renderToTexture(texture);
            this.prepareVertexes();
        }
    }

    public renderToBackBuffer():void {
        if (this._renderTarget != null) {
            this.processVertexes();
            super.renderToBackBuffer();
            this.prepareVertexes();
        }
    }

    public validate():void {
        this._canvas.height = this._canvas.clientHeight;
        this._canvas.width = this._canvas.clientWidth;

        this._stageVertexData = TextureUtil.cacheVertexData(
            TextureUtil.DUMMY_VERTEX_DATA,
            this._canvas.clientWidth,
            this._canvas.clientHeight
        );

        this.updateViewport(new Rectangle(
            0, 0, this._canvas.width,
            this._canvas.height
        ));
    }

    public update(offset:float):void {
        const time = performance.now();

        //-----------------------------------

        this._stage.update(offset);

        //-----------------------------------

        if (this._frameAverageUpdateTime.length >= Renderer.AVERAGE_TIME_LIMIT) {
            this._frameAverageUpdateTime.shift();
        }

        this._frameAverageUpdateTime.push(
            this._frameUpdateTime = (
                performance.now() - time
            )
        );
    }

    public render():void {
        const time = performance.now();
        this._frameDrawCallsCount = 0;
        this._frameEntityCount = 0;
        this._frameParticlesCount = 0;

        //-----------------------------------

        this._state.reset();
        this.selectBlendMode(BlendMode.NORMAL);
        this.clear(Color.GREY);

        //-----------------------------------

        this.prepareVertexes();
        this._stage.render(this);
        this.processVertexes();
        this._render.flush();

        //-----------------------------------

        if (this._frameAverageRenderTime.length >= Renderer.AVERAGE_TIME_LIMIT) {
            this._frameAverageRenderTime.shift();
        }

        this._frameAverageRenderTime.push(
            this._frameRenderTime = (
                performance.now() - time
            )
        );

        //-----------------------------------

        this._statsView.renderStats(
            this._frameAverageUpdateTime,
            this._frameAverageRenderTime
        );
    }

    public get frameEntityCount():int {
        return this._frameEntityCount;
    }

    public get frameDrawCallsCount():int {
        return this._frameDrawCallsCount;
    }

    public get frameParticlesCount():int {
        return this._frameParticlesCount;
    }

    public get frameAverageRenderTime():int {
        let averageTimeLimit = Renderer.AVERAGE_TIME_LIMIT;
        let summaryTime = 0;

        //-----------------------------------

        for (const time of this._frameAverageRenderTime) {
            summaryTime += time;
        }

        //-----------------------------------

        return (
            summaryTime / averageTimeLimit
        );
    }

    public get frameRenderTime():int {
        return this._frameRenderTime;
    }

    public get frameAverageUpdateTime():int {
        let averageTimeLimit = Renderer.AVERAGE_TIME_LIMIT;
        let summaryTime = 0;

        //-----------------------------------

        for (const time of this._frameAverageUpdateTime) {
            summaryTime += time;
        }

        //-----------------------------------

        return (
            summaryTime / averageTimeLimit
        );
    }

    public get frameUpdateTime():int {
        return this._frameUpdateTime;
    }

    public get state():RenderEntityState {
        return this._state.entity;
    }

    public get stage():Stage {
        return this._stage;
    }
}
