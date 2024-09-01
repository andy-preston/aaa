export const byteBuffer = () => {
    let buffer: Array<number> = [];

    let address = 0;

    const getTwo = (): [number, number] => {
        address += 2;
        return [buffer.shift()!, buffer.shift()!];
    };

    const has = (wanted: number) => wanted > 0 && buffer.length >= wanted;

    const add = (bytes: Array<number>) => {
        buffer = buffer.concat(bytes);
    };

    const setAddress = (to: number) => {
        address = to;
    };

    const baseAddress = () => address;

    const endAddress = () => address + buffer.length;

    const recordSize = () => Math.min(16, buffer.length);

    return {
        "getTwo": getTwo,
        "add": add,
        "has": has,
        "setAddress": setAddress,
        "baseAddress": baseAddress,
        "endAddress": endAddress,
        "recordSize": recordSize
    };
}