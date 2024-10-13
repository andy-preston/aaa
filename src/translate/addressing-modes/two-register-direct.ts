import { checkOperandCount, numericOperand } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, [string, number]> = new Map([
    ["CPC", ["0000_01", 2]],
    ["SBC", ["0000_10", 2]],
    ["ADD", ["0000_11", 2]], // LSL and
    ["LSL", ["0000_11", 1]], // ADD are almost the same
    ["CPSE", ["0001_00", 2]],
    ["CP", ["0001_01", 2]],
    ["SUB", ["0001_10", 2]],
    ["ADC", ["0001_11", 2]], // ROL and
    ["ROL", ["0001_11", 1]], // ADC are almost the same
    ["AND", ["0010_00", 2]], // TST and
    ["TST", ["0010_00", 1]], // AND are almost the same
    ["EOR", ["0010_01", 2]], // CLR and
    ["CLR", ["0010_01", 1]], // EOR are almost the same
    ["OR", ["0010_10", 2]],
    ["MOV", ["0010_11", 2]],
    ["MUL", ["1001_11", 2]]
]);

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    const [prefix, operandCount] = mapping.get(line.mnemonic)!;
    checkOperandCount(
        line.operands,
        operandCount == 1 ? ["register"] : ["register", "register"]
    );
    const registers = line.operands;
    if (operandCount == 1) {
        registers[1] = registers[0]!;
    }
    return template(`${prefix}rd dddd_rrrr`, [
        ["d", numericOperand("register", registers[0]!)],
        ["r", numericOperand("register", registers[1]!)]
    ]);
};
