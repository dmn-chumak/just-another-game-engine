import { ResourceManager } from '../../system/ResourceManager';
import { DisplayContainer } from '../common/DisplayContainer';
import { BaseTexture } from '../context/BaseTexture';
import { TextureAtlas } from '../context/TextureAtlas';
import { Matrix } from '../geometry/Matrix';
import { Material } from '../materials/Material';
import { ParticlesMaterial } from '../materials/particles/content';
import { Renderer } from '../Renderer';
import { QUAD_VTX_COUNT } from '../Vector';
import { QUAD_IDX_COUNT } from '../Vector';
import { Particle } from './Particle';

export class ParticleMap extends DisplayContainer {
    public static readonly PARTICLES_LIMIT:int = 10_000;

    protected _textureAtlas:TextureAtlas;
    protected _particles:Vector<Particle>;

    public constructor(textureAtlas:TextureAtlas, material:Material = null) {
        if (material == null) {
            material = ResourceManager.obtainMaterial(ParticlesMaterial.NAME);
        }

        //-----------------------------------

        super(material);

        //-----------------------------------

        this._textureAtlas = textureAtlas;
        this._particles = [];
    }

    protected renderParticlesList(render:Renderer):void {
        const particlesLimit = ParticleMap.PARTICLES_LIMIT;

        if (this._particles.length >= particlesLimit) {
            // removing extra particles from the list to achieve limits
            this._particles = this._particles.slice(
                this._particles.length - particlesLimit
            );
        }

        //-----------------------------------

        const particlesCount = this._particles.length;

        //-----------------------------------

        render.attachParticlesCount(particlesCount);
        render.attachMaterialWithTexture(this._material, this._textureAtlas.texture);
        render.attachIndexesData(particlesCount * QUAD_IDX_COUNT);

        const vertexDataPointer = render.createVertexesDataPointer(particlesCount * QUAD_VTX_COUNT);
        const stateMatrix = render.state.matrix;
        const stateAlpha = render.state.alpha;

        //-----------------------------------

        for (let index = 0, offset = 0; index < particlesCount; index++) {
            const particle = this._particles[index];
            const texture = particle.texture;
            const vertexData = texture.vertexData;

            for (let vertex = 0; vertex < vertexData.length; vertex += 4) {
                vertexDataPointer[offset++] = Matrix.transformAxisX(stateMatrix, particle.x, particle.y);
                vertexDataPointer[offset++] = Matrix.transformAxisY(stateMatrix, particle.x, particle.y);
                vertexDataPointer[offset++] = particle.rotation;

                // TODO: investigate & implement different pivot positions here
                vertexDataPointer[offset++] = vertexData[vertex] - texture.width / 2;
                vertexDataPointer[offset++] = vertexData[vertex + 1] - texture.height / 2;

                vertexDataPointer[offset++] = vertexData[vertex + 2];
                vertexDataPointer[offset++] = vertexData[vertex + 3];
                vertexDataPointer[offset++] = stateAlpha;
            }
        }
    }

    public attachParticle(particle:Particle):void {
        this._particles.push(particle);
    }

    public attachParticleData(texture:BaseTexture, x:int, y:int, rotation:int = 0):void {
        const particle = new Particle(x, y, rotation);
        particle.texture = texture;
        this.attachParticle(particle);
    }

    public removeAllParticles():void {
        this._particles = [];
    }

    public removeParticle(particle:Particle):void {
        const index = this._particles.indexOf(particle);
        if (index !== -1) {
            this._particles.splice(index, 1);
        }
    }

    public render(render:Renderer):void {
        if (this._visible) {
            this.renderParticlesList(render);
            this.renderChildrenList(render);
        }
    }
}
