import { ShaderDataType } from '../context/ShaderDataType';

export class AttributeData {
    public type:ShaderDataType;
    public dataLength:int;
    public dataOffset:int;
    public name:string;

    public constructor(name:string, type:ShaderDataType) {
        this.name = name;
        this.type = type;
    }
}
