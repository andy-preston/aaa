export type PairOfBytes = [number, number];

export const hexBuffer = () => {
    let buffer: Array<number> = [];
    // AVR Program Memory is word addressed. Hex files are byte addressed
    let byteAddress = 0;

    const restartAt = (newByteAddress: number) => {
        if (buffer.length != 0) {
            throw new Error("Restarting HEX buffer without it being empty");
        }
        byteAddress = newByteAddress;
    };

    const pairs = function*(): Generator<PairOfBytes, void, unknown>  {
        const pairsToDeliver = Math.min(16, buffer.length) / 2;
        for (let pair = 0; pair < pairsToDeliver; pair++) {
            byteAddress += 2;
            yield [buffer.shift()!, buffer.shift()!];
        }
    };

    const add = (bytes: Array<number>) => {
        buffer = buffer.concat(bytes);
    };

    const address = () => byteAddress;

    const hasAtLeast = (wanted: number) =>
        wanted > 0 && buffer.length >= wanted;

    const isContinuous = (newAddress: number) =>
        newAddress == byteAddress + buffer.length;

    return {
        "restartAt": restartAt,
        "pairs": pairs,
        "add": add,
        "address": address,
        "hasAtLeast": hasAtLeast,
        "isContinuous": isContinuous
    };
};

export type HexBuffer = ReturnType<typeof hexBuffer>;
