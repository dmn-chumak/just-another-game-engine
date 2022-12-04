import { BaseTexture } from './context/BaseTexture';
import { BlendMode } from './context/BlendMode';
import { Matrix } from './geometry/Matrix';
import { Material } from './materials/Material';
import { RenderEntityState } from './RenderEntityState';

export class RenderState {
    public material:Material;
    public previousMaterial:Material;
    public uniformsData:Dictionary<Float32Array>;
    public blendMode:BlendMode;
    public textures:Vector<BaseTexture>;
    public entityStack:Vector<RenderEntityState>;
    public entity:RenderEntityState;

    public constructor() {
        this.material = null;
        this.previousMaterial = null;
        this.uniformsData = null;
        this.blendMode = BlendMode.NORMAL;
        this.textures = [];
        this.entity = { matrix: new Matrix(), alpha: 1 };
        this.entityStack = [];
    }

    public attachEntityState(matrix:Matrix, alpha:float = 1):void {
        const state:RenderEntityState = {};

        state.matrix = Matrix.concat(this.entity.matrix, matrix);
        state.alpha = this.entity.alpha * alpha;

        this.entityStack.push(this.entity);
        this.entity = state;
    }

    public detachEntityState():void {
        this.entity = this.entityStack.pop();
    }

    public isBlendModeChanged(blendMode:BlendMode):boolean {
        return (this.blendMode !== blendMode);
    }

    public isMaterialChanged(material:Material):boolean {
        return (this.material !== material);
    }

    public isUniformsDataChanged(uniformsData:Dictionary<Float32Array>):boolean {
        return (this.uniformsData !== uniformsData);
    }

    public isTexturesChanged(textures:Vector<BaseTexture>):boolean {
        if (this.textures === textures) {
            return false;
        }

        if (this.textures == null || textures == null || this.textures.length !== textures.length) {
            return true;
        }

        for (let index = 0; index < textures.length; index++) {
            if (this.textures[index].native !== textures[index].native) {
                return true;
            }
        }

        return false;
    }

    public isTextureChanged(texture:BaseTexture):boolean {
        if (this.textures != null && this.textures.length !== 1) {
            return true;
        }

        if (this.textures == null && texture == null) {
            return false;
        }

        return (this.textures[0].native !== texture.native);
    }

    public reset():void {
        this.material = null;
        this.previousMaterial = null;
        this.uniformsData = null;
        this.blendMode = BlendMode.NORMAL;
        this.textures = [];
    }
}
