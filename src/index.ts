import { RepeatableBitmap } from './engine/renderer/common/RepeatableBitmap';
import { TextField } from './engine/renderer/text/TextField';
import { System } from './engine/system/System';

window.onload = async () => {
    System.initialize('#wrapper');

    const fontDescription = await (await fetch('./font/TornadoC.font')).arrayBuffer();
    const fontTexture = System.render.createTexture();
    fontTexture.uploadFromImage(document.querySelector<HTMLImageElement>('#texture-font'));
    System.resourceManager.registerBitmapFont('TornadoC', fontTexture, fontDescription);

    const texture = System.render.createTexture();
    texture.uploadFromImage(document.querySelector<HTMLImageElement>('#texture'));

    const bitmap = new RepeatableBitmap(texture);
    bitmap.width = window.innerWidth;
    bitmap.height = window.innerHeight;
    System.stage.appendChild(bitmap);

    const field = new TextField('Example', 'TornadoC', 0xFFFFFF, 15);
    field.x = field.y = 200;
    System.stage.appendChild(field);

    window.onresize = () => {
        bitmap.width = window.innerWidth;
        bitmap.height = window.innerHeight;
    };
};
