import { GeneratedCode } from "../generate/mod.ts";
import { Instruction } from "../source-code/mod.ts";

type Test = [Instruction, GeneratedCode];

export type Tests = Array<Test>;

export const description = (test: Test) => {
    const instruction = test[0];
    const operands = instruction[1].length == 0
        ? "; no operands"
        : instruction[1].join(", ");
    return `${instruction[0]} ${operands}`;
};
