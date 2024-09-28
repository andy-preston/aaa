import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter } from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

const mapping: Map<string, string> = new Map([
    ["RCALL", "1"],
    ["RJMP", "0"]
]);

export const encode = (
    instruction: Instruction,
    convert: OperandConverter
): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    convert.checkCount(operands, ["relativeJump"]);
    const absoluteAddress = operands[0]!;
    const operationBit = mapping.get(mnemonic)!;
    return template(`110${operationBit}_kkkk kkkk_kkkk`, [
        ["k", convert.numeric("relativeJump", absoluteAddress)]
    ]);
};
