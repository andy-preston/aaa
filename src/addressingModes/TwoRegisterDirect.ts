import { type GeneratedCode, template } from "../binaryTemplate.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands.ts";

const mapping: Record<string, [string, number]> = {
    "CPC":  ["0000_01", 2],
    "SBC":  ["0000_10", 2],
    "ADD":  ["0000_11", 2], // LSL and
    "LSL":  ["0000_11", 1], // ADD are almost the same
    "CPSE": ["0001_00", 2],
    "CP":   ["0001_01", 2],
    "SUB":  ["0001_10", 2],
    "ADC":  ["0001_11", 2], // ROL and
    "ROL":  ["0001_11", 1], // ADC are almost the same
    "AND":  ["0010_00", 2], // TST and
    "TST":  ["0010_00", 1], // AND are almost the same
    "EOR":  ["0010_01", 2], // CLR and
    "CLR":  ["0010_01", 1], // EOR are almost the same
    "OR":   ["0010_10", 2],
    "MOV":  ["0010_11", 2],
    "MUL":  ["1001_11", 2]
};

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mapping)) {
        return null;
    }
    const [prefix, operandCount] = mapping[instruction.mnemonic]!;
    checkCount(
        instruction.operands,
        operandCount == 1 ? ["register"] : ["register", "register"]
    );
    const registers = instruction.operands;
    if (operandCount == 1) {
        registers[1] = registers[0]!;
    }
    check("register", 0, registers[0]!);
    check("register", 1, registers[1]!);
    return template(`${prefix}rd_dddd_rrrr`, {
        "d": registers[0],
        "r": registers[1]
    });
};
