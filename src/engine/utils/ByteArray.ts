import { NumberUtil } from './NumberUtil';

export class ByteArray {
    private static readonly ENCODING:string = 'utf-8';

    private readonly _textDecoder:TextDecoder;
    private readonly _textEncoder:TextEncoder;

    private _source:ArrayBuffer;
    private _buffer:DataView;
    private _capacity:int;
    private _length:int;
    private _position:int;

    public constructor(source:ArrayBuffer = null) {
        this._textDecoder = new TextDecoder(ByteArray.ENCODING);
        this._textEncoder = new TextEncoder();

        this._source = (source == null) ? new ArrayBuffer(4) : source;
        this._buffer = new DataView(this._source);

        this._capacity = this._source.byteLength;
        this._length = (source == null) ? 0 : this._capacity;
        this._position = 0;
    }

    public readBoolean():boolean {
        return (this.readByte() !== 0);
    }

    public readByteArray(length:int):ByteArray {
        const cursor = this.moveCursor(length);

        return new ByteArray(
            this._source.slice(cursor, cursor + length)
        );
    }

    public readByte():byte {
        const cursor = this.moveCursor(1);
        return this._buffer.getInt8(cursor);
    }

    public readDouble():double {
        const cursor = this.moveCursor(8);
        return this._buffer.getFloat64(cursor);
    }

    public readFloat():float {
        const cursor = this.moveCursor(4);
        return this._buffer.getFloat32(cursor);
    }

    public readInt():int {
        const cursor = this.moveCursor(4);
        return this._buffer.getInt32(cursor);
    }

    public readShort():short {
        const cursor = this.moveCursor(2);
        return this._buffer.getInt16(cursor);
    }

    public readUnsignedByte():byte {
        const cursor = this.moveCursor(1);
        return this._buffer.getUint8(cursor);
    }

    public readUnsignedInt():int {
        const cursor = this.moveCursor(4);
        return this._buffer.getUint32(cursor);
    }

    public readUnsignedShort():short {
        const cursor = this.moveCursor(2);
        return this._buffer.getUint16(cursor);
    }

    public readUTF():string {
        return this.readUTFBytes(this.readUnsignedShort());
    }

    public readUTFBytes(length:int):string {
        if (length !== 0) {
            const cursor = this.moveCursor(length);

            return this._textDecoder.decode(
                new Uint8Array(
                    this._source,
                    cursor,
                    length
                )
            );
        }

        return '';
    }

    public writeBoolean(value:boolean):void {
        this.writeByte(value ? 1 : 0);
    }

    public writeByteArray(value:ByteArray):void {
        const cursor = this.moveCursorEnsuring(value._length);

        const source = new Int8Array(value._source, 0, value._length);
        const target = new Int8Array(this._source, cursor);

        target.set(source);
    }

    public writeByte(value:byte):void {
        const cursor = this.moveCursorEnsuring(1);
        this._buffer.setInt8(cursor, value);
    }

    public writeDouble(value:double):void {
        const cursor = this.moveCursorEnsuring(8);
        this._buffer.setFloat64(cursor, value);
    }

    public writeFloat(value:float):void {
        const cursor = this.moveCursorEnsuring(4);
        this._buffer.setFloat32(cursor, value);
    }

    public writeInt(value:int):void {
        const cursor = this.moveCursorEnsuring(4);
        this._buffer.setInt32(cursor, value);
    }

    public writeShort(value:short):void {
        const cursor = this.moveCursorEnsuring(2);
        this._buffer.setInt16(cursor, value);
    }

    public writeUnsignedByte(value:byte):void {
        const cursor = this.moveCursorEnsuring(1);
        this._buffer.setUint8(cursor, value);
    }

    public writeUnsignedInt(value:int):void {
        const cursor = this.moveCursorEnsuring(4);
        this._buffer.setUint32(cursor, value);
    }

    public writeUnsignedShort(value:short):void {
        const cursor = this.moveCursorEnsuring(2);
        this._buffer.setUint16(cursor, value);
    }

    public writeUTF(value:string):void {
        this.writeUnsignedShort(value.length);
        this.writeUTFBytes(value);
    }

    public writeUTFBytes(value:string):void {
        if (this._textEncoder.encodeInto != null) {
            const estimatedLength = value.length * 2;
            const cursor = this.moveCursorEnsuring(estimatedLength);
            const target = new Uint8Array(
                this._source,
                cursor,
                estimatedLength
            );

            const encodeResult = this._textEncoder.encodeInto(value, target);
            const overflow = estimatedLength - encodeResult.written;

            if (overflow > 0) {
                this._position -= overflow;
                this._length -= overflow;
            }
        } else {
            const buffer = this._textEncoder.encode(value);
            const cursor = this.moveCursorEnsuring(buffer.byteLength);
            const target = new Uint8Array(
                this._source,
                cursor,
                buffer.byteLength
            );

            target.set(buffer);
        }
    }

    public clear():void {
        this._source = new ArrayBuffer(this._capacity = 4);
        this._buffer = new DataView(this._source);
        this._length = this._position = 0;
    }

    private moveCursorEnsuring(step:int):int {
        const current = this._position;
        this._position += step;

        if (this._position >= this._capacity) {
            const source = new Int8Array(this._source);

            const capacity = NumberUtil.nextPowerOfTwo(this._position);
            const targetBuffer = new ArrayBuffer(capacity);
            const target = new Int8Array(targetBuffer);

            this._capacity = capacity;
            this._buffer = new DataView(targetBuffer);
            this._source = targetBuffer;

            target.set(source);
        }

        if (this._position > this._length) {
            this._length = this._position;
        }

        return current;
    }

    private moveCursor(step:int):int {
        if (this._position + step > this._capacity) {
            throw new Error('End of array was encountered.');
        }

        const current = this._position;
        this._position += step;
        return current;
    }

    public set position(value:int) {
        if (value >= 0 && value <= this._length) {
            this._position = value;
        }
    }

    public get bytesAvailable():int {
        return this._length - this._position;
    }

    public get position():int {
        return this._position;
    }

    public get source():ArrayBuffer {
        return this._source;
    }

    public get length():int {
        return this._length;
    }
}
