import { assertEquals } from "assert";
import type { Generate, GeneratedCode } from "../generate/mod.ts";
import type { Tokens } from "../source-line/mod.ts";

export type Tests = Array<[Tokens, GeneratedCode]>;

export const testDescription = (source: Tokens): string => {
    const operands = source[2].join(", ");
    const description = operands ? operands : "; No operands";
    return `${source[1]} ${description}`;
};

export const testing = (tests: Tests, generate: Generate) => {
    for (const test of tests) {
        const source = test[0] as Tokens;
        Deno.test(`Basic code generation: ${testDescription(source)}`, () => {
            assertEquals(generate(source), test[1]);
        });
    }
};
