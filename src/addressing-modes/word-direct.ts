import { OurContext } from "../context/mod.ts";
import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter } from "../operands/mod.ts";
import type { Instruction } from "../source-line/mod.ts";

export const encode = (
    instruction: Instruction,
    convert: OperandConverter,
    _ourContext: OurContext
): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (mnemonic != "MOVW") {
        return undefined;
    }
    convert.checkCount(operands, ["anyRegisterPair", "anyRegisterPair"]);
    return template("0000_0001 dddd_rrrr", [
        ["d", convert.numeric("anyRegisterPair", operands[0]!)],
        ["r", convert.numeric("anyRegisterPair", operands[1]!)]
    ]);
};
