import type { Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, [string, string]> = new Map([
    ["FMUL", ["1 0", "1"]],
    ["FMULS", ["1 1", "0"]],
    ["FMULSU", ["1 1", "1"]],
    ["MULSU", ["1 0", "0"]],
    ["MULS", ["0 d", "r"]]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }

        const registerType = line.mnemonic == "MULS"
            ? "immediateRegister"
            : "multiplyRegister";
        operands.checkCount(line.operands, [registerType, registerType]);

        const [firstOperation, secondOperation] = mapping.get(line.mnemonic)!;

        const firstRegister = operands.numeric(registerType, line.operands[0]!);
        if (firstRegister.which == "errors") {
            return firstRegister;
        }

        const secondRegister = operands.numeric(registerType, line.operands[1]!);
        if (secondRegister.which == "errors") {
            return secondRegister;
        }

        return template(`0000_001${firstOperation}ddd_${secondOperation}rrr`, [
            ["d", firstRegister.value],
            ["r", secondRegister.value]
        ]);
    };
