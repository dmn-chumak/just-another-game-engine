import { NumberUtil } from '../../utils/NumberUtil';

export class Point {
    public x:float;
    public y:float;

    public constructor(x:float = 0, y:float = 0) {
        this.adjust(x, y);
    }

    public adjust(x:float, y:float):void {
        this.x = x;
        this.y = y;
    }

    public static distance(point1:Point, point2:Point):float {
        return Math.sqrt(
            Math.pow(point1.x - point2.x, 2) +
            Math.pow(point1.y - point2.y, 2)
        );
    }

    public static interpolate(point1:Point, point2:Point, value:float):Point {
        return new Point(
            point2.x + value * (point1.x - point2.x),
            point2.y + value * (point1.y - point2.y)
        );
    }

    public static polar(length:float, angle:float):Point {
        return new Point(
            length * Math.cos(angle),
            length * Math.sin(angle)
        );
    }

    public equals(point:Point):boolean {
        return (
            NumberUtil.equals(this.x, point.x) &&
            NumberUtil.equals(this.y, point.y)
        );
    }

    public append(point:Point):Point {
        return new Point(this.x + point.x, this.y + point.y);
    }

    public remove(point:Point):Point {
        return new Point(this.x - point.x, this.y - point.y);
    }

    public clone():Point {
        return new Point(this.x, this.y);
    }

    public get length():float {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
