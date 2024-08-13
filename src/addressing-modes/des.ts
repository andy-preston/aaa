import { type GeneratedCode, template } from "../generate/mod.ts";
import {
    type OperandConverter,
    type SymbolicOperands,
    checkCount
} from "../operands/mod.ts";
import type { Mnemonic } from "../tokens/tokens.ts";

export const encode = (
    mnemonic: Mnemonic,
    operands: SymbolicOperands,
    convert: OperandConverter
): GeneratedCode | undefined => {
    if (mnemonic != "DES") {
        return undefined;
    }
    checkCount(operands, ["nybble"]);
    const nybble = convert.numeric("nybble", operands[0]!);
    return template("1001_0100 KKKK_1011", [["K", nybble]]);
};
