import type { GeneratedCode } from "./types.ts";

export const littleEndian = (code: GeneratedCode): GeneratedCode => {
    const little: Array<number> = [];
    const values = code.values();
    for (;;) {
        const even = values.next();
        if (even.done) {
            return little as GeneratedCode;
        }
        little.push(values.next().value);
        little.push(even.value);
    }
};
