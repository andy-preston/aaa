import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

const mapping: Map<string, [string, string]> = new Map([
    ["FMUL", ["1 0", "1"]],
    ["FMULS", ["1 1", "0"]],
    ["FMULSU", ["1 1", "1"]],
    ["MULSU", ["1 0", "0"]],
    ["MULS", ["0 d", "r"]]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): OptionalCode => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        const registerType = line.mnemonic == "MULS"
            ? "immediateRegister"
            : "multiplyRegister";
        operands.checkCount(line.operands, [registerType, registerType]);
        const [firstOperation, secondOperation] = mapping.get(line.mnemonic)!;
        return template(`0000_001${firstOperation}ddd_${secondOperation}rrr`, [
            ["d", operands.numeric(registerType, line.operands[0]!)],
            ["r", operands.numeric(registerType, line.operands[1]!)]
        ]);
    };
