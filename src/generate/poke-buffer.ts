import { GeneratedCode } from "./mod.ts";

export const pokeBuffer = () => {
    let theBuffer: Array<GeneratedCode> = [];

    const poke = (bytes: Array<number>) => {
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

    function* peek(): Generator<GeneratedCode, void, unknown> {
        for (const code of theBuffer) {
            yield code;
        }
        theBuffer = [];
    };

    return { "poke": poke, "peek": peek };
};

type PokeBuffer = ReturnType<typeof pokeBuffer>;
export type BufferPoke = PokeBuffer["poke"];
export type BufferPeek = PokeBuffer["peek"];
