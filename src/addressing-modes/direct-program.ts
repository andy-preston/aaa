import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter } from "../operands/mod.ts";
import type { Instruction } from "../source-line/mod.ts";

const mapping: Map<string, string> = new Map([
    ["CALL", "1"],
    ["JMP", "0"]
]);

export const encode = (
    instruction: Instruction,
    convert: OperandConverter
): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    convert.checkCount(operands, ["address"]);
    const operationBit = mapping.get(mnemonic)!;
    return template(`1001_010k kkkk_11${operationBit}k kkkk_kkkk kkkk_kkkk`, [
        ["k", convert.numeric("address", operands[0]!)]
    ]);
};
