export const checksum = (address: number, bytes: number) => {
    // https://en.wikipedia.org/wiki/Intel_HEX

    let total = bytes + (address & 0xff) + ((address & 0xff00) >> 8);

    return {
        "byte": (byte: number) => {
            total += byte;
        },
        "sum": () => 0x0100 - (total & 0xff)
    };
};
