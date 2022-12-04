import { System } from '../../../system/System';
import { ShaderUtil } from '../../../utils/ShaderUtil';
import { ShaderDataType } from '../../context/ShaderDataType';
import { AttributeData } from '../AttributeData';
import { Material } from '../Material';
import { UniformData } from '../UniformData';

export class DistanceFieldMaterial extends Material {
    public static readonly NAME:string = 'distanceFieldMaterial';

    public static readonly SCREEN_SCALE_UNIFORM:string = 'u_screenScale';
    public static readonly COLOR_UNIFORM:string = 'u_color';

    public constructor() {
        const attributes = [
            new AttributeData(Material.IMAGE_XY_ATTRIB, ShaderDataType.VECTOR_2),
            new AttributeData(Material.IMAGE_UV_ATTRIB, ShaderDataType.VECTOR_3)
        ];

        //-----------------------------------

        const uniforms = [
            new UniformData(DistanceFieldMaterial.SCREEN_SCALE_UNIFORM, ShaderDataType.VECTOR_2, new Float32Array([ 0, 0 ])),
            new UniformData(DistanceFieldMaterial.COLOR_UNIFORM, ShaderDataType.VECTOR_4, new Float32Array([ 0, 0, 0, 1 ])),
            new UniformData(Material.WORLD_MATRIX_UNIFORM, ShaderDataType.MATRIX_4),
            new UniformData(Material.IMAGE_UNIFORM, ShaderDataType.TEXTURE)
        ];

        //-----------------------------------

        super(
            System.render.createProgram(
                ShaderUtil.attachName(DistanceFieldMaterial.NAME, require('./content.glsl')),
                ShaderUtil.attachName(DistanceFieldMaterial.NAME, require('../default/vertex.glsl'))
            ),
            attributes,
            uniforms
        );
    }
}
