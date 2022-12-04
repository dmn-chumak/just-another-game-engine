import { BaseTexture } from '../context/BaseTexture';
import { ShaderDataType } from '../context/ShaderDataType';

export class UniformData {
    public texture:BaseTexture;
    public type:ShaderDataType;
    public dataLength:int;
    public data:Float32Array;
    public name:string;

    public constructor(name:string, type:ShaderDataType, data:Float32Array = null) {
        this.texture = null;
        this.name = name;
        this.dataLength = 0;
        this.data = data;
        this.type = type;
    }
}
