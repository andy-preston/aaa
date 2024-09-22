import { assertEquals } from "assert";
import type { OurContext } from "../context/mod.ts";
import { type GeneratedCode, translator } from "../generate/mod.ts";
import type { Instruction } from "../source-line/mod.ts";
import { operandConverter } from "../operands/mod.ts";

export type Tests = Array<[Instruction, GeneratedCode]>;

export const testDescription = (source: Instruction): string => {
    const operands = source[1].join(", ");
    const description = operands ? operands : "; No operands";
    return `${source[0]} ${description}`;
};

export const testing = (tests: Tests, context: OurContext) => {
    const translate = translator(context, operandConverter(context));
    for (const test of tests) {
        const source = test[0] as Instruction;
        Deno.test(`Basic code generation: ${testDescription(source)}`, () => {
            const code = translate(source);
            assertEquals(code, test[1]);
            context.programMemoryStep(code);
        });
    }
};
