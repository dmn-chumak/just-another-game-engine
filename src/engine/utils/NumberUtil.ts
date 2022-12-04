export class NumberUtil {
    public static getSign(num:int):int {
        return (num > 0) ? 1 : -1;
    }

    public static randomSignInt(size:int, offset:int = 0):int {
        return Math.floor(
              (Math.random() * size + offset)
            * (Math.random() > 0.5 ? 1 : -1)
        );
    }

    public static randomInt(size:int, offset:int = 1):int {
        return Math.floor(Math.random() * size + offset);
    }

    public static randomValue<Type>(source:Vector<Type>):Type {
        return source[this.randomInt(source.length, 0)];
    }

    public static randomSign(size:float, offset:float = 0):float {
        return (
              (Math.random() * size + offset)
            * (Math.random() > 0.5 ? 1 : -1)
        );
    }

    public static random(size:float, offset:float = 1):float {
        return (Math.random() * size + offset);
    }

    public static saturate(value:float, min:float = 0, max:float = 1):float {
        return Math.max(Math.min(value, max), min);
    }

    public static equals(first:float, second:float, precision:float = 0.01):boolean {
        return (Math.abs(first - second) <= precision);
    }

    public static round(num:float, precision:int = 2):float {
        const dec = Math.pow(10, precision);

        return (
            Math.floor(Math.round(num * dec)) / dec
        );
    }

    public static equalsPowerOfTwo(source:int):boolean {
        return (this.nextPowerOfTwo(source) === source);
    }

    public static nextPowerOfTwo(source:int):int {
        let result:int = 1;

        while (result < source) {
            result <<= 1;
        }

        return result;
    }
}
