import type { OurContext } from "../context/mod.ts";
import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter } from "../operands/mod.ts";
import type { Instruction } from "../source-line/mod.ts";

export const encode = (
    instruction: Instruction,
    convert: OperandConverter,
    _ourContext: OurContext
): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (mnemonic != "DES") {
        return undefined;
    }
    convert.checkCount(operands, ["nybble"]);
    const nybble = convert.numeric("nybble", operands[0]!);
    return template("1001_0100 KKKK_1011", [["K", nybble]]);
};
