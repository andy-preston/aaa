import type { Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
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

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }

        const [prefix, operandCount] = mapping.get(line.mnemonic)!;

        operands.checkCount(
            line.operands,
            operandCount == 1 ? ["register"] : ["register", "register"]
        );

        const firstRegister = operands.numeric("register", line.operands[0]!);
        if (firstRegister.which == "errors") {
            return firstRegister;
        }

        const secondRegister = operands.numeric(
            "register",
            line.operands[operandCount == 1 ? 0 : 1]!
        );
        if (secondRegister.which == "errors") {
            return secondRegister;
        }

        return template(`${prefix}rd dddd_rrrr`, [
            ["d", firstRegister.value],
            ["r", secondRegister.value]
        ]);
    };
