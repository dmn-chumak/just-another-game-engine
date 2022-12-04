import { Stage } from '../renderer/common/Stage';
import { Point } from '../renderer/geometry/Point';
import { DefaultMaterial } from '../renderer/materials/default/content';
import { DistanceFieldMaterial } from '../renderer/materials/distanceField/content';
import { ParticlesMaterial } from '../renderer/materials/particles/content';
import { Renderer } from '../renderer/Renderer';
import { CacheManager } from './CacheManager';
import { GameEventDispatcher } from './events/GameEventDispatcher';
import { ResourceManager } from './ResourceManager';

export class System {
    private static _instance:System;

    private readonly _render:Renderer;

    private readonly _observer:GameEventDispatcher;
    private readonly _resourceManager:ResourceManager;
    private readonly _cacheManager:CacheManager;

    private _deviceSize:Point;
    private _updatesCounter:Vector<int>;
    private _isWindowFocused:boolean;
    private _isLoading:boolean;
    private _frameUpdateTime:int;
    private _frameTimer:int;

    private constructor(wrapper:string) {
        this._render = new Renderer(document.querySelector(wrapper));

        //-----------------------------------

        this._observer = new GameEventDispatcher();
        this._resourceManager = new ResourceManager();
        this._cacheManager = new CacheManager();

        //-----------------------------------

        this._deviceSize = new Point();
        this._updatesCounter = [];
        this._isWindowFocused = true;
        this._isLoading = false;
        this._frameUpdateTime = -1;
        this._frameTimer = -1;
    }

    private windowFocusHandler = ():void => {
        this._isWindowFocused = true;
    };

    private windowBlurHandler = ():void => {
        this._isWindowFocused = false;

        if (this._frameTimer != null) {
            window.cancelAnimationFrame(this._frameTimer);
            this.updateFrame();
        }
    };

    private updateFrame():void {
        if (this._isWindowFocused) {
            this._frameTimer = window.requestAnimationFrame(this.play.bind(this));
        } else {
            this._frameTimer = window.setTimeout(this.play.bind(this), 1000 / 60);
        }
    }

    private cancelFrame():void {
        if (this._frameTimer != null) {
            if (this._isWindowFocused) {
                window.cancelAnimationFrame(this._frameTimer);
            } else {
                window.clearTimeout(this._frameTimer);
            }

            this._frameTimer = null;
        }
    }

    private init():void {
        this._resourceManager.registerMaterial(DistanceFieldMaterial);
        this._resourceManager.registerMaterial(DefaultMaterial);
        this._resourceManager.registerMaterial(ParticlesMaterial);

        this.play();
    }

    private play():void {
        if (this._frameTimer == null) {
            this._frameUpdateTime = performance.now();
        }

        //-----------------------------------

        if (this._deviceSize.y !== window.innerHeight || this._deviceSize.x !== window.innerWidth) {
            this._deviceSize.y = window.innerHeight;
            this._deviceSize.x = window.innerWidth;

            this._render.stage.validate(this._deviceSize);
            this._render.validate();
        }

        //-----------------------------------

        const currentTime = performance.now();
        const currentUpdateTime = (currentTime - this._frameUpdateTime) / 1000;
        this._frameUpdateTime = currentTime;

        this._render.update(currentUpdateTime);
        this._render.render();

        //-----------------------------------

        if (this._updatesCounter.length === 100) {
            this._updatesCounter.shift();
        }

        this._updatesCounter.push(currentUpdateTime);
        const totalUpdateTime = this._updatesCounter.reduce((summary, value) => (summary + value), 0);
        const framesUpdateTime = totalUpdateTime / this._updatesCounter.length;
        const frameRate = 1 / framesUpdateTime;

        document.querySelector('#values').innerHTML = (
            'Frame rate: ' + frameRate.toFixed(0) + '<br />' +
            'Render time: ' + this._render.frameRenderTime.toFixed(2) + 'ms<br />' +
            'Render time (avg): ' + this._render.frameAverageRenderTime.toFixed(2) + 'ms<br />' +
            'Update time: ' + this._render.frameUpdateTime.toFixed(2) + 'ms<br />' +
            'Update time (avg): ' + this._render.frameAverageUpdateTime.toFixed(2) + 'ms<br />' +
            'Particles: ' + this._render.frameParticlesCount + '<br />' +
            'Objects: ' + this._render.frameEntityCount + '<br />' +
            'Draw calls: ' + this._render.frameDrawCallsCount
        );

        //-----------------------------------

        this.updateFrame();
    }

    private stop():void {
        this.cancelFrame();
    }

    //-----------------------------------

    public static initialize(wrapper:string):System {
        if (this._instance == null) {
            this._instance = new System(wrapper);
            this._instance.init();
        }

        return this._instance;
    }

    public static play():void {
        this._instance.play();
    }

    public static stop():void {
        this._instance.stop();
    }

    //-----------------------------------

    public static set isLoading(value:boolean) {
        this._instance._isLoading = value;
    }

    public static get isLoading():boolean {
        return this._instance._isLoading;
    }

    //-----------------------------------

    public static get resourceManager():ResourceManager {
        return this._instance._resourceManager;
    }

    public static get cacheManager():CacheManager {
        return this._instance._cacheManager;
    }

    public static get render():Renderer {
        return this._instance._render;
    }

    public static get stage():Stage {
        return this._instance._render.stage;
    }

    public static get observer():GameEventDispatcher {
        return this._instance._observer;
    }
}
