import type { GeneratedCode } from "../translate/mod.ts";

export const pokeBuffer = () => {
    let theBuffer: Array<GeneratedCode> = [];

    const poke = (data: Array<number> | string) => {
        const bytes: Array<number> = typeof data == "string"
            ? Array.from(new TextEncoder().encode(data))
            : data;
        for (const byte of bytes) {
            if (byte < 0 || byte > 0xff) {
                throw new RangeError(`byte value out of range: ${byte}`);
            }
        }
        if (bytes.length % 2 == 1) {
            bytes.push(0);
        }
        while (bytes.length > 0) {
            theBuffer.push(bytes.splice(0, 4) as GeneratedCode);
        }
    };

    const peek = function* (): Generator<GeneratedCode, void, unknown> {
        for (const code of theBuffer) {
            yield code;
        }
        theBuffer = [];
    };

    return {
        "poke": poke,
        "peek": peek
    };
};
