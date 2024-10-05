type PairOfBytes = [number, number];

let buffer: Array<number> = [];

// AVR code is word addressed. Hex files are byte addressed
let byteAddress = 0;

export const restartAt = (newByteAddress: number) => {
    if (buffer.length != 0) {
        throw new Error("Restarting HEX buffer without it being empty");
    }
    byteAddress = newByteAddress;
};

export const bytePairsFromBuffer =
    function*(): Generator<PairOfBytes, void, unknown>  {
        const pairsToDeliver = Math.min(16, buffer.length) / 2;
        for (let pair = 0; pair < pairsToDeliver; pair++) {
            byteAddress += 2;
            yield [buffer.shift()!, buffer.shift()!];
        }
    };

export const byteBufferHasAtLeast = (wanted: number) =>
    wanted > 0 && buffer.length >= wanted;

export const addBytesToBuffer = (bytes: Array<number>) => {
    buffer = buffer.concat(bytes);
};

export const isContinuous = (newAddress: number) =>
    newAddress == byteAddress + buffer.length;

export const byteBufferAddress = () => byteAddress;
