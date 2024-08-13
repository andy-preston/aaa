import { assertEquals } from "assert";
import {
    type GeneratedCode,
    type GeneratorFunction,
    littleEndian
} from "../generate/mod.ts";
import { Tokens } from "../tokens/tokens.ts";

export type Tests = Array<[Tokens, GeneratedCode]>;

export const testing = (tests: Tests, generate: GeneratorFunction) => {
    for (const test of tests) {
        const source = test[0] as Tokens;
        const mnemonic = source[1] as string;
        const operands = source[2].join(", ");
        Deno.test(`Basic code generation: ${mnemonic} ${operands}`, () => {
            assertEquals(littleEndian(generate(source)), test[1]);
        });
    }
};
