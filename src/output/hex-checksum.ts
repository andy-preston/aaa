export const checksum = (address: number, recordSize: number) => {
    // https://en.wikipedia.org/wiki/Intel_HEX

    let total = recordSize + (address & 0xff) + ((address & 0xff00) >> 8);

    return {
        "byte": (byte: number) => {
            total += byte;
        },
        "sum": () => 0x0100 - (total & 0xff)
    };
};
