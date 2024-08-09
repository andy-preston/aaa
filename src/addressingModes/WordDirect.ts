import { type GeneratedCode, template } from "../binaryTemplate.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount, registerPair } from "../operands.ts";

export const encode = (
    instruction: Instruction,
    _pc: number
): GeneratedCode | null => {
    if (instruction.mnemonic != "MOVW") {
        return null;
    }
    checkCount(instruction.operands, ["anyRegisterPair", "anyRegisterPair"]);
    check("anyRegisterPair", 0, instruction.operands[0]!);
    check("anyRegisterPair", 1, instruction.operands[1]!);
    return template("0000_0001_dddd_rrrr", {
        "d": registerPair(instruction.operands[0]!, 0),
        "r": registerPair(instruction.operands[1]!, 0)
    });
};
