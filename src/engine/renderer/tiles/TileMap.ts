import { ResourceManager } from '../../system/ResourceManager';
import { DisplayContainer } from '../common/DisplayContainer';
import { TextureAtlas } from '../context/TextureAtlas';
import { TextureUtil } from '../context/TextureUtil';
import { DefaultMaterial } from '../materials/default/content';
import { Material } from '../materials/Material';
import { Renderer } from '../Renderer';
import { QUAD_VTX_COUNT } from '../Vector';
import { QUAD_IDX_COUNT } from '../Vector';
import { Tile } from './Tile';

export class TileMap extends DisplayContainer {
    protected _textureAtlas:TextureAtlas;
    protected _tiles:Vector<Tile>;

    public constructor(textureAtlas:TextureAtlas, material:Material = null) {
        if (material == null) {
            material = ResourceManager.obtainMaterial(DefaultMaterial.NAME);
        }

        //-----------------------------------

        super(material);

        //-----------------------------------

        this._textureAtlas = textureAtlas;
        this._tiles = [];
    }

    protected attachMaterialExtraData(vertexDataPointer:Float32Array, offset:int):void {
        // empty..
    }

    protected renderTilesList(render:Renderer):void {
        const tilesCount = this._tiles.length;

        //-----------------------------------

        render.attachParticlesCount(tilesCount);
        render.attachMaterialWithTexture(this._material, this._textureAtlas.texture);
        render.attachIndexesData(tilesCount * QUAD_IDX_COUNT);

        const vertexDataPointer = render.createVertexesDataPointer(tilesCount * QUAD_VTX_COUNT);
        const dataDelta = this._material.strideElements * QUAD_VTX_COUNT;

        //-----------------------------------

        for (let index = 0; index < tilesCount; index++) {
            const currentTile = this._tiles[index];
            const offset = index * dataDelta;

            TextureUtil.copyVertexDataWithOffsets(
                vertexDataPointer,
                this._material,
                currentTile.texture.vertexData,
                currentTile.x, currentTile.y,
                render.state.matrix,
                render.state.alpha,
                offset
            );

            this.attachMaterialExtraData(
                vertexDataPointer,
                offset
            );
        }
    }

    public attachTile(tile:Tile):void {
        this._tiles.push(tile);
    }

    public attachTileData(name:string, x:int, y:int):void {
        const tile = new Tile(x, y);
        tile.texture = this._textureAtlas.obtainTexture(name);
        this.attachTile(tile);
    }

    public removeAllTiles():void {
        this._tiles = [];
    }

    public removeTile(tile:Tile):void {
        const index = this._tiles.indexOf(tile);
        if (index !== -1) {
            this._tiles.splice(index, 1);
        }
    }

    public removeTileData(x:int, y:int):void {
        for (let index = 0; index < this._tiles.length; index++) {
            const tile = this._tiles[index];

            if (tile.x === x && tile.y === y) {
                this._tiles.splice(index, 1);
                break;
            }
        }
    }

    public render(render:Renderer):void {
        if (this._visible) {
            this.renderTilesList(render);
            this.renderChildrenList(render);
        }
    }

    public get tiles():Vector<Tile> {
        return this._tiles;
    }
}
