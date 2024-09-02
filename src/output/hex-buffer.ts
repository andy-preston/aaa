export const byteBuffer = (startAddress: number) => {
    let buffer: Array<number> = [];

    let address = startAddress;

    const recordSize = () => Math.min(16, buffer.length);

    const getTwo = (): [number, number] => {
        address += 2;
        return [buffer.shift()!, buffer.shift()!];
    };

    const has = (wanted: number) => wanted > 0 && buffer.length >= wanted;

    const add = (bytes: Array<number>) => {
        buffer = buffer.concat(bytes);
    };

    const baseAddress = () => address;

    const isContinuous = (newAddress: number) =>
        newAddress == address + buffer.length;

    const restartAt = (newAddress: number) => {
        if (buffer.length != 0) {
            throw new Error("Restarting HEX buffer without it being empty");
        }
        address = newAddress;
    };

    return {
        "recordSize": recordSize,
        "getTwo": getTwo,
        "has": has,
        "add": add,
        "isContinuous": isContinuous,
        "baseAddress": baseAddress,
        "restartAt": restartAt
    };
};
