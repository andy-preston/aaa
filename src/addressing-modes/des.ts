import { type GeneratedCode, template } from "../generated-code.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands/mod.ts";

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (instruction.mnemonic != "DES") {
        return undefined;
    }
    checkCount(instruction.operands, ["nybble"]);
    check("nybble", 0, instruction.operands[0]!);
    return template("1001_0100 KKKK_1011", [
        ["K", instruction.operands[0]!]
    ]);
};
