import { BaseTexture } from '../context/BaseTexture';
import { Context } from '../context/Context';
import { Program } from '../context/Program';
import { ShaderDataType } from '../context/ShaderDataType';
import { VertexBuffer } from '../context/VertexBuffer';
import { AttributeData } from './AttributeData';
import { UniformData } from './UniformData';

export class Material {
    public static readonly WORLD_MATRIX_UNIFORM:string = 'u_worldMatrix';
    public static readonly IMAGE_UNIFORM:string = 'u_image';

    public static readonly IMAGE_XY_ATTRIB:string = 'a_imageXY';
    public static readonly IMAGE_UV_ATTRIB:string = 'a_imageUV';

    protected _cachedAttributes:Vector<WebGLAttribLocation>;
    protected _attributes:Vector<AttributeData>;
    protected _cachedStrideElements:int;
    protected _cachedStride:int;

    protected _cachedUniforms:Vector<WebGLUniformLocation>;
    protected _uniforms:Vector<UniformData>;

    protected _program:Program;

    public constructor(program:Program, attributes:Vector<AttributeData>, uniforms:Vector<UniformData>) {
        this._program = program;

        //-----------------------------------

        this._cachedAttributes = [];
        this._attributes = attributes;
        this._cachedStride = 0;
        this.cacheAttributesLocation();

        for (const attribute of this._attributes) {
            attribute.dataLength = this.resolveDataLength(attribute.type);
            attribute.dataOffset = this._cachedStride;
            this._cachedStride += attribute.dataLength * VertexBuffer.ELEMENT_SIZE;
        }

        //-----------------------------------

        this._cachedUniforms = [];
        this._cachedStrideElements = this._cachedStride / VertexBuffer.ELEMENT_SIZE;
        this._uniforms = uniforms;
        this.cacheUniformsLocation();

        for (const uniform of this._uniforms) {
            uniform.dataLength = this.resolveDataLength(uniform.type);
        }
    }

    protected resolveDataLength(dataType:ShaderDataType):int {
        if (dataType === ShaderDataType.VECTOR_2) {
            return 2;
        } else if (dataType === ShaderDataType.VECTOR_3) {
            return 3;
        } else if (dataType === ShaderDataType.VECTOR_4) {
            return 4;
        } else if (dataType === ShaderDataType.MATRIX_3) {
            return 9;
        } else if (dataType === ShaderDataType.MATRIX_4) {
            return 16;
        } else {
            return 1;
        }
    }

    protected cacheAttributesLocation():void {
        for (let index = 0; index < this._attributes.length; index++) {
            this._cachedAttributes[index] = this._program.resolveAttributeLocation(
                this._attributes[index].name
            );
        }
    }

    protected cacheUniformsLocation():void {
        for (let index = 0; index < this._uniforms.length; index++) {
            this._cachedUniforms[index] = this._program.resolveUniformLocation(
                this._uniforms[index].name
            );
        }
    }

    public obtainUniformData(name:string):UniformData {
        for (const uniform of this._uniforms) {
            if (uniform.name === name) {
                return uniform;
            }
        }

        return null;
    }

    public applyProgram(context:Context):void {
        context.selectProgram(this._program);
    }

    public applyProgramAttributes():void {
        for (let index = 0; index < this._attributes.length; index++) {
            const attribute = this._attributes[index];

            this._program.connectAttributePointer(
                this._cachedAttributes[index],
                attribute.dataLength,
                this._cachedStride,
                attribute.dataOffset
            );
        }
    }

    public applyProgramUniforms(textures:Vector<BaseTexture>, uniformsData:Dictionary<Float32Array>):void {
        for (let index = 0, sampler = 0; index < this._uniforms.length; index++) {
            const uniform = this._uniforms[index];
            let uniformData = uniform.data;

            if (uniformsData.hasOwnProperty(uniform.name)) {
                uniformData = uniformsData[uniform.name];
            }

            if (uniform.type === ShaderDataType.MATRIX_3 || uniform.type === ShaderDataType.MATRIX_4) {
                this._program.connectUniformMatrix(
                    this._cachedUniforms[index],
                    uniform.dataLength, uniformData
                );
            } else if (uniform.type === ShaderDataType.TEXTURE) {
                if (sampler < textures.length) {
                    this._program.connectTextureSampler(
                        this._cachedUniforms[index],
                        textures[sampler], sampler++
                    );
                } else {
                    this._program.connectTextureSampler(
                        this._cachedUniforms[index],
                        uniform.texture, sampler++
                    );
                }
            } else {
                this._program.connectUniformValue(
                    this._cachedUniforms[index],
                    uniform.dataLength, uniformData
                );
            }
        }
    }

    public get strideElements():int {
        return this._cachedStrideElements;
    }

    public get stride():int {
        return this._cachedStride;
    }
}
