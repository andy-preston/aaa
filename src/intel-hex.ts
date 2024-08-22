export const intelHex = (bytes: Array<number>) => {
    const hex = (value: number, digits: number) =>
        value.toString(16).toUpperCase().padStart(digits, '0');

    // extended segment address always zero unless something has more
    // than 64K of flash - bear in mind this applies to the ATMega 1284
    // which I want to support
    const oo = [':020000020000FC'];
    // This is just assuming that the code starts at 0 and carries on until
    // the end... there's no support for jumping from address to address:
    //
    // MOVW R0, Z      .org 200            LDI R18, 42
    //
    // :02|0000|02|0000|FC - extended segment address 0000
    // :02|0000|00|0F01|EE - MOVW instruction (probably)
    // :02|0190|00|2AE2|61 - LDI - it just jumped to the new address
    // :00|0000|01|FF      - EOF
    for (let i = 0; i < code.length; i += 16) {
        const page = code.slice(i, i + 16);
        let o = `:${hex(page.length,2)}${hex(i,4)}00`;
        let s = page.length + ((i >> 8) & 0xff) + (i & 0xff);
        for (let j = 0; j < page.length; j++) {
            o += hex(page[j], 2);
            s += page[j];
        }
        s = ((~s) + 1) & 0xff;
        o += hex(s, 2);
        oo.push(o);
    }
    oo.push(':00000001FF\n');
    return oo.join('\n');
};
