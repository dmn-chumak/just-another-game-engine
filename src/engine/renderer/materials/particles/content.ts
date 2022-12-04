import { System } from '../../../system/System';
import { ShaderUtil } from '../../../utils/ShaderUtil';
import { ShaderDataType } from '../../context/ShaderDataType';
import { AttributeData } from '../AttributeData';
import { Material } from '../Material';
import { UniformData } from '../UniformData';

export class ParticlesMaterial extends Material {
    public static readonly NAME:string = 'particlesMaterial';

    public static readonly VERTEXES_XY_ATTRIB:string = 'a_vertexesXY';

    public constructor() {
        const attributes = [
            new AttributeData(Material.IMAGE_XY_ATTRIB, ShaderDataType.VECTOR_3),
            new AttributeData(ParticlesMaterial.VERTEXES_XY_ATTRIB, ShaderDataType.VECTOR_2),
            new AttributeData(Material.IMAGE_UV_ATTRIB, ShaderDataType.VECTOR_3)
        ];

        //-----------------------------------

        const uniforms = [
            new UniformData(Material.WORLD_MATRIX_UNIFORM, ShaderDataType.MATRIX_4),
            new UniformData(Material.IMAGE_UNIFORM, ShaderDataType.TEXTURE)
        ];

        //-----------------------------------

        super(
            System.render.createProgram(
                ShaderUtil.attachName(ParticlesMaterial.NAME, require('../default/fragment.glsl')),
                ShaderUtil.attachName(ParticlesMaterial.NAME, require('./content.glsl'))
            ),
            attributes,
            uniforms
        );
    }
}
