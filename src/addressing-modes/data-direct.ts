import { type GeneratedCode, template } from "../generate/mod.ts";
import type { Instruction } from "../instruction/mod.ts";
import {
    type OperandIndex,
    type TypeName,
    check,
    checkCount,
    registerFrom16
} from "../operands/mod.ts";

// I am not completely sure at this point how these instructions work
// there appear to be two versions, and I'm assuming that one operates on
// low SRAM devices and the other operates on devices with more SRAM
// in avrlass, he refers to the "big one" as LDS and the "little one" as LDS.RC

const bigMode = true;

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["LDS", ["0", 0, 1]],
    ["STS", ["1", 1, 0]]
]);

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    const [operationBit, registerIndex, addressIndex] =
        mapping.get(instruction.mnemonic)!;
    const registerType: TypeName = bigMode ? "register" : "immediateRegister";
    checkCount(
        instruction.operands,
        registerIndex == 0 ?
            [registerType, "ramAddress"] :
            ["ramAddress", registerType]
    );
    check(registerType, registerIndex, instruction.operands[registerIndex]!);
    check("ramAddress", addressIndex, instruction.operands[addressIndex]!);
    const prefix = bigMode ? "1001_00" : "1010_";
    const suffix = bigMode ? "d dddd_0000 kkkk_kkkk kkkk_kkkk" : "kkk dddd_kkkk";
    const register = instruction.operands[registerIndex]!;
    return template(`${prefix}${operationBit}${suffix}`, [
        ["d", bigMode ? register : registerFrom16(register)],
        ["k", instruction.operands[addressIndex]!]
    ]);
};
