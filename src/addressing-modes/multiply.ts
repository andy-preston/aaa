import { type GeneratedCode, template } from "../generate/mod.ts";
import {
    type TypeName,
    checkOperandCount,
    numericOperand
} from "../operands/mod.ts";
import type { Line } from "../source-code/mod.ts";

const mapping: Map<string, [string, string]> = new Map([
    ["FMUL", ["1 0", "1"]],
    ["FMULS", ["1 1", "0"]],
    ["FMULSU", ["1 1", "1"]],
    ["MULSU", ["1 0", "0"]],
    ["MULS", ["0 d", "r"]]
]);

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    const registerType: TypeName = line.mnemonic == "MULS"
        ? "immediateRegister"
        : "multiplyRegister";
    checkOperandCount(line.operands, [registerType, registerType]);
    const [firstOperation, secondOperation] = mapping.get(line.mnemonic)!;
    return template(`0000_001${firstOperation}ddd_${secondOperation}rrr`, [
        ["d", numericOperand(registerType, line.operands[0]!)],
        ["r", numericOperand(registerType, line.operands[1]!)]
    ]);
};
