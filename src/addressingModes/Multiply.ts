import { type GeneratedCode, template } from "../generated-code.ts";
import type { Instruction } from "../instruction.ts";
import { registerFrom16 } from "../operands.ts";
import { type TypeName, check, checkCount } from "../operands.ts";

const mapping: Map<string, [string, string]> = new Map([
    ["FMUL", ["1 0", "1"]],
    ["FMULS", ["1 1", "0"]],
    ["FMULSU", ["1 1", "1"]],
    ["MULSU", ["1 0", "0"]],
    ["MULS", ["0 d", "r"]]
]);

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    const registerType: TypeName =
        instruction.mnemonic == "MULS"
            ? "immediateRegister"
            : "multiplyRegister";

    checkCount(instruction.operands, [registerType, registerType]);
    check(registerType, 0, instruction.operands[0]!);
    check(registerType, 1, instruction.operands[1]!);
    const [firstOperation, secondOperation] = mapping.get(
        instruction.mnemonic
    )!;
    return template(`0000_001${firstOperation}ddd_${secondOperation}rrr`, [
        ["d", registerFrom16(instruction.operands[0]!)],
        ["r", registerFrom16(instruction.operands[1]!)]
    ]);
};
