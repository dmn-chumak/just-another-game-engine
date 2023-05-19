import { RepeatableBitmap } from './engine/renderer/common/RepeatableBitmap';
import { System } from './engine/system/System';

window.onload = () => {
    System.initialize('#wrapper');

    const texture = System.render.createTexture();
    texture.uploadFromImage(document.querySelector<HTMLImageElement>('#texture'));

    const bitmap = new RepeatableBitmap(texture);
    bitmap.width = window.innerWidth;
    bitmap.height = window.innerHeight;
    System.stage.appendChild(bitmap);

    window.onresize = () => {
        bitmap.width = window.innerWidth;
        bitmap.height = window.innerHeight;
    };
};
