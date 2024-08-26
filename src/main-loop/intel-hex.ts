export const intelHex = (bytes: Array<number>) => {
    const hex = (value: number, digits: number) =>
        value.toString(16).toUpperCase().padStart(digits, '0');

    // extended segment address always zero unless something has more
    // than 64K of flash - bear in mind this applies to the ATMega 1284
    // which I want to support
    const oo = [':020000020000FC'];
    for (let i = 0; i < bytes.length; i += 16) {
        const page = bytes.slice(i, i + 16);
        let o = `:${hex(page.length,2)}${hex(i,4)}00`;
        let s = page.length + ((i >> 8) & 0xff) + (i & 0xff);
        for (let j = 0; j < page.length; j++) {
            o += hex(page[j]!, 2);
            s += page[j]!;
        }
        s = ((~s) + 1) & 0xff;
        o += hex(s, 2);
        oo.push(o);
    }
    oo.push(':00000001FF\n');
    return oo.join('\n');
};
