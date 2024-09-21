import { type BufferPoke } from "../generate/mod.ts";

export const pokeDirective = (poke: BufferPoke) =>
    (data: Array<number> | string) => {
        poke(
            typeof data == "string"
                ? Array.from(new TextEncoder().encode(data))
                : data
        );
    };
