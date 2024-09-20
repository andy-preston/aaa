import type { OurContext } from "../context/mod.ts";
import type { GeneratedCode } from "../generate/mod.ts";
import type { Output } from "../output/mod.ts";

function* chunk(bytes: Array<number>) {
    if (bytes.length % 2 == 1) {
        bytes.push(0);
    }
    while (bytes.length > 0) {
        yield bytes.splice(0, 4) as GeneratedCode;
    }
};

export const pokeDirective = (ourContext: OurContext, output: Output) =>
    (data: Array<number> | string) => {
        const useData = typeof data == "string"
            ? Array.from(new TextEncoder().encode(data))
            : data;
        for (const code of chunk(useData)) {
            output(ourContext.programMemoryPos, code, "");
            ourContext.programMemoryPos += 2;
        }
    };
