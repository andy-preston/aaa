import type { GeneratedCode } from "../generate/mod.ts";
import type { TestTokens } from "../source-code/testing.ts";

type Test = [TestTokens, GeneratedCode];

export type Tests = Array<Test>;

export const description = (test: Test) => {
    const instruction = test[0];
    const operands = instruction[2].length == 0
        ? "; no operands"
        : instruction[2].join(", ");
    return `${instruction[1]} ${operands}`;
};
