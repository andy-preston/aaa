import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter, SymbolicOperands } from "../operands/mod.ts";
import type { Mnemonic } from "../tokens/tokens.ts";

const mapping: Map<string, string> = new Map([
    ["CALL", "1"],
    ["JMP", "0"]
]);

export const encode = (
    mnemonic: Mnemonic,
    operands: SymbolicOperands,
    convert: OperandConverter
): GeneratedCode | undefined => {
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    convert.checkCount(operands, ["address"]);
    const operationBit = mapping.get(mnemonic)!;
    return template(`1001_010k kkkk_11${operationBit}k kkkk_kkkk kkkk_kkkk`, [
        ["k", convert.numeric("address", operands[0]!)]
    ]);
};
