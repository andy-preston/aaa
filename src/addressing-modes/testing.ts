import { assertEquals } from "assert";
import type { Generate, GeneratedCode } from "../generate/mod.ts";
import type { Instruction } from "../source-line/mod.ts";

export type Tests = Array<[Instruction, GeneratedCode]>;

export const testDescription = (source: Instruction): string => {
    const operands = source[1].join(", ");
    const description = operands ? operands : "; No operands";
    return `${source[0]} ${description}`;
};

export const testing = (tests: Tests, generate: Generate) => {
    for (const test of tests) {
        const source = test[0] as Instruction;
        Deno.test(`Basic code generation: ${testDescription(source)}`, () => {
            assertEquals(generate(source), test[1]);
        });
    }
};
