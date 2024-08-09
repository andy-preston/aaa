import { type GeneratedCode, template } from "../binaryTemplate.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands.ts";

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (instruction.mnemonic != "DES") {
        return undefined;
    }
    checkCount(instruction.operands, ["nybble"]);
    check("nybble", 0, instruction.operands[0]!);
    return template("1001_0100_KKKK_1011", new Map([
        ["K", instruction.operands[0]!]
    ]));
};
