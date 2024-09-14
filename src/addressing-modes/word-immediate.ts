import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter, SymbolicOperands } from "../operands/mod.ts";
import type { Mnemonic } from "../source-line/mod.ts";

const mapping: Map<string, string> = new Map([
    ["ADIW", "0"],
    ["SBIW", "1"]
]);

export const encode = (
    mnemonic: Mnemonic,
    operands: SymbolicOperands,
    convert: OperandConverter
): GeneratedCode | undefined => {
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    convert.checkCount(operands, ["registerPair", "sixBits"]);
    const operationBit = mapping.get(mnemonic)!;
    return template(`1001_011${operationBit} KKdd_KKKK`, [
        ["d", convert.numeric("registerPair", operands[0]!)],
        ["K", convert.numeric("sixBits", operands[1]!)]
    ]);
};
