import { NumberUtil } from '../../utils/NumberUtil';
import { Point } from './Point';

export class Rectangle {
    public width:float;
    public height:float;
    public x:float;
    public y:float;

    public constructor(x:float = 0, y:float = 0, width:float = 0, height:float = 0) {
        this.adjust(x, y, width, height);
    }

    public adjust(x:float, y:float, width:float, height:float):void {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    public containsPoint(point:Point):boolean {
        return (
            point.y < this.y + this.height &&
            point.y > this.y &&
            point.x < this.x + this.width &&
            point.x > this.x
        );
    }

    public containsRectangle(rect:Rectangle):boolean {
        return (
            rect.y + rect.height < this.y + this.height &&
            rect.y > this.y &&
            rect.x + rect.width < this.x + this.width &&
            rect.x > this.x
        );
    }

    public equals(rect:Rectangle):boolean {
        return (
            NumberUtil.equals(this.height, rect.height) &&
            NumberUtil.equals(this.y, rect.y) &&
            NumberUtil.equals(this.width, rect.width) &&
            NumberUtil.equals(this.x, rect.x)
        );
    }

    public clone():Rectangle {
        return new Rectangle(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    public get bottom():float {
        return this.y + this.height;
    }

    public get top():float {
        return this.y;
    }

    public get right():float {
        return this.x + this.width;
    }

    public get left():float {
        return this.x;
    }
}
