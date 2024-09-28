import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter, TypeName } from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

const mapping: Map<string, [string, string]> = new Map([
    ["FMUL", ["1 0", "1"]],
    ["FMULS", ["1 1", "0"]],
    ["FMULSU", ["1 1", "1"]],
    ["MULSU", ["1 0", "0"]],
    ["MULS", ["0 d", "r"]]
]);

export const encode = (
    instruction: Instruction,
    convert: OperandConverter
): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const registerType: TypeName =
        mnemonic == "MULS" ? "immediateRegister" : "multiplyRegister";
    convert.checkCount(operands, [registerType, registerType]);
    const [firstOperation, secondOperation] = mapping.get(mnemonic)!;
    return template(`0000_001${firstOperation}ddd_${secondOperation}rrr`, [
        ["d", convert.numeric(registerType, operands[0]!)],
        ["r", convert.numeric(registerType, operands[1]!)]
    ]);
};
