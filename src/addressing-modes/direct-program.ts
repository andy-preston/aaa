import { type GeneratedCode, template } from "../generate/mod.ts";
import { checkOperandCount, numericOperand } from "../operands/mod.ts";
import type { Line } from "../source-code/mod.ts";

const mapping: Map<string, string> = new Map([
    ["CALL", "1"],
    ["JMP", "0"]
]);

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    checkOperandCount(line.operands, ["address"]);
    const operationBit = mapping.get(line.mnemonic)!;
    return template(`1001_010k kkkk_11${operationBit}k kkkk_kkkk kkkk_kkkk`, [
        ["k", numericOperand("address", line.operands[0]!)]
    ]);
};
