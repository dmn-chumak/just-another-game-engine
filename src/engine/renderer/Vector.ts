export const QUAD_IDX_COUNT:int = 6;
export const QUAD_VTX_COUNT:int = 4;

export function generateIndices(vector:Uint16Array, idx:int, end:int, vtx:int):void {
    while (idx < end) {
        vector[idx + 0] = vtx + 0;
        vector[idx + 1] = vtx + 1;
        vector[idx + 2] = vtx + 2;
        vector[idx + 3] = vtx + 2;
        vector[idx + 4] = vtx + 3;
        vector[idx + 5] = vtx + 0;

        idx += QUAD_IDX_COUNT;
        vtx += QUAD_VTX_COUNT;
    }
}

export function increaseVertexes(buffer:ArrayBuffer, length:int):ArrayBuffer {
    const source = new Float32Array(buffer);

    if (source.length >= length) {
        return buffer;
    }

    const output = new ArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT);
    const target = new Float32Array(output);
    target.set(source);

    return output;
}

export function increaseIndices(buffer:ArrayBuffer, length:int):ArrayBuffer {
    const source = new Uint16Array(buffer);

    if (source.length >= length) {
        return buffer;
    }

    const output = new ArrayBuffer(length * Uint16Array.BYTES_PER_ELEMENT);
    const target = new Uint16Array(output);
    target.set(source);

    return output;
}
