import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter, SymbolicOperands } from "../operands/mod.ts";
import type { Mnemonic } from "../load-tokenise/mod.ts";

export const encode = (
    mnemonic: Mnemonic,
    operands: SymbolicOperands,
    convert: OperandConverter
): GeneratedCode | undefined => {
    if (mnemonic != "MOVW") {
        return undefined;
    }
    convert.checkCount(operands, ["anyRegisterPair", "anyRegisterPair"]);
    return template("0000_0001 dddd_rrrr", [
        ["d", convert.numeric("anyRegisterPair", operands[0]!)],
        ["r", convert.numeric("anyRegisterPair", operands[1]!)]
    ]);
};
