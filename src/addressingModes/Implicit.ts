import { type GeneratedCode, template } from "../binaryTemplate.ts";
import type { Instruction } from "../instruction.ts";
import { checkCount } from "../operands.ts";

const mappings: Record<string, string> = {
    "BREAK":  "1001_0101_1001_1000",
    "NOP":    "0000_0000_0000_0000",
    "RET":    "1001_0101_0000_1000",
    "RETI":   "1001_0101_0001_1000",
    "SLEEP":  "1001_0101_1000_1000",
    "WDR":    "1001_0101_1010_1000",
    // Program Memory Constant Addressing
    "ELPM":   "1001_0101_1101_1000",
    "LPM":    "1001_0101_1100_1000",
    "SPM":    "1001_0101_1110_1000",
    // Program with Memory Post-increment
    "SPM.Z+": "1001_0101_1111_1000",
    // Indirect Program Addressing
    "IJMP":   "1001_0100_0000_1001",
    "EIJMP":  "1001_0100_0001_1001",
    "ICALL":  "1001_0101_0000_1001",
    "EICALL": "1001_0101_0001_1001",
};

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mappings)) {
        return null;
    }
    checkCount(instruction.operands, []);
    return template(mappings[instruction.mnemonic]!, {});
};

