import { type GeneratedCode, template } from "../generate/mod.ts";
import type { Instruction } from "../instruction/mod.ts";;
import { check, checkCount, registerPair } from "../operands/mod.ts";

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (instruction.mnemonic != "MOVW") {
        return undefined;
    }
    checkCount(instruction.operands, ["anyRegisterPair", "anyRegisterPair"]);
    check("anyRegisterPair", 0, instruction.operands[0]!);
    check("anyRegisterPair", 1, instruction.operands[1]!);
    return template("0000_0001 dddd_rrrr", [
        ["d", registerPair(instruction.operands[0]!, 0)],
        ["r", registerPair(instruction.operands[1]!, 0)]
    ]);
};