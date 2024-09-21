import { assertEquals } from "assert";
import type { GeneratedCode, Translate } from "../generate/mod.ts";
import type { Instruction } from "../source-line/mod.ts";

export type Tests = Array<[Instruction, GeneratedCode]>;

export const testDescription = (source: Instruction): string => {
    const operands = source[1].join(", ");
    const description = operands ? operands : "; No operands";
    return `${source[0]} ${description}`;
};

export const testing = (tests: Tests, translate: Translate) => {
    for (const test of tests) {
        const source = test[0] as Instruction;
        Deno.test(`Basic code generation: ${testDescription(source)}`, () => {
            assertEquals(translate(source), test[1]);
        });
    }
};
