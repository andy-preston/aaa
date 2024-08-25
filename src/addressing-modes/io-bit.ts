import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter, SymbolicOperands } from "../operands/mod.ts";
import type { Mnemonic } from "../load-tokenise/mod.ts";

const mapping: Map<string, string> = new Map([
    ["SBI", "10"],
    ["SBIC", "01"],
    ["SBIS", "11"],
    ["CBI", "00"]
]);

export const encode = (
    mnemonic: Mnemonic,
    operands: SymbolicOperands,
    convert: OperandConverter
): GeneratedCode | undefined => {
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    convert.checkCount(operands, ["port", "bitIndex"]);
    const operationBits = mapping.get(mnemonic)!;
    return template(`1001_10${operationBits} AAAA_Abbb`, [
        ["A", convert.numeric("port", operands[0]!)],
        ["b", convert.numeric("bitIndex", operands[1]!)]
    ]);
};
