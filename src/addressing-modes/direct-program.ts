import { type GeneratedCode, template } from "../process/mod.ts";
import { checkOperandCount, numericOperand } from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

const mapping: Map<string, string> = new Map([
    ["CALL", "1"],
    ["JMP", "0"]
]);

export const encode = (instruction: Instruction): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    checkOperandCount(operands, ["address"]);
    const operationBit = mapping.get(mnemonic)!;
    return template(`1001_010k kkkk_11${operationBit}k kkkk_kkkk kkkk_kkkk`, [
        ["k", numericOperand("address", operands[0]!)]
    ]);
};
