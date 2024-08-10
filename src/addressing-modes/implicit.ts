import { type GeneratedCode, template } from "../generate/mod.ts";
import type { Instruction } from "../instruction.ts";
import { checkCount } from "../operands/mod.ts";

const mapping: Map<string, string> = new Map([
    ["BREAK", "1001_0101 1001_1000"],
    ["NOP", "0000_0000 0000_0000"],
    ["RET", "1001_0101 0000_1000"],
    ["RETI", "1001_0101 0001_1000"],
    ["SLEEP", "1001_0101 1000_1000"],
    ["WDR", "1001_0101 1010_1000"],
    // Program Memory Constant Addressing
    // ELPM has implied R0 - might be nice to support optional register
    ["ELPM", "1001_0101 1101_1000"],
    ["LPM", "1001_0101 1100_1000"],
    ["SPM", "1001_0101 1110_1000"],
    // Program with Memory Post-increment
    ["SPM.Z+", "1001_0101 1111_1000"],
    // Indirect Program Addressing
    ["IJMP", "1001_0100 0000_1001"],
    ["EIJMP", "1001_0100 0001_1001"],
    ["ICALL", "1001_0101 0000_1001"],
    ["EICALL", "1001_0101 0001_1001"]
]);

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    checkCount(instruction.operands, []);
    return template(mapping.get(instruction.mnemonic)!, []);
};
