import { type GeneratedCode, template } from "../binaryTemplate.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount, registerFrom16 } from "../operands.ts";

const prefixes: Record<string, string> = {
    "CPI":  "0011",
    "SBCI": "0100",
    "SUBI": "0101",
    "ORI":  "0110", // SBR and
    "SBR":  "0110", // ORI are the same instruction
    "ANDI": "0111", // CBR and
    "CBR":  "0111", // ANDI are ALMOST the same instruction
    "LDI":  "1110", // SER and
    "SER":  "1110"  // LDI are ALMOST the same instruction
};

const immediate = (mnemonic: string, operand1: number) => {
    switch (mnemonic) {
        // Clear bits in register is an AND with the inverse of the operand
        case "CBR": return 0xff - operand1;
        // Set all bits is basically an LDI with FF
        case "SER": return 0xff;
        // All the other instructions have "sensible" operands
        default: return operand1;
    }
}

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!(instruction.mnemonic in prefixes)) {
        return undefined;
    }
    checkCount(
        instruction.operands,
        instruction.mnemonic != "SER"
            ? ["immediateRegister", "byte"]
            : ["immediateRegister"]
    );
    check("immediateRegister", 0, instruction.operands[0]!);
    if (instruction.mnemonic != "SER") {
        check("byte", 1, instruction.operands[1]!);
    }
    const prefix = prefixes[instruction.mnemonic]!;
    return template(`${prefix}_KKKK_dddd_KKKK`, {
        "d": registerFrom16(instruction.operands[0]!),
        "K": immediate(instruction.mnemonic, instruction.operands[1]!)
    });
};
