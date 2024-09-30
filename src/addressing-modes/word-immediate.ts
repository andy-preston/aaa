import { type GeneratedCode, template } from "../generate/mod.ts";
import { checkOperandCount, numericOperand } from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

const mapping: Map<string, string> = new Map([
    ["ADIW", "0"],
    ["SBIW", "1"]
]);

export const encode = (instruction: Instruction): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    checkOperandCount(operands, ["registerPair", "sixBits"]);
    const operationBit = mapping.get(mnemonic)!;
    return template(`1001_011${operationBit} KKdd_KKKK`, [
        ["d", numericOperand("registerPair", operands[0]!)],
        ["K", numericOperand("sixBits", operands[1]!)]
    ]);
};
