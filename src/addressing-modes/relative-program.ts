import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter, SymbolicOperands } from "../operands/mod.ts";
import type { Mnemonic } from "../tokens/mod.ts";

const mapping: Map<string, string> = new Map([
    ["RCALL", "1"],
    ["RJMP", "0"]
]);

export const encode = (
    mnemonic: Mnemonic,
    operands: SymbolicOperands,
    convert: OperandConverter
): GeneratedCode | undefined => {
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    convert.checkCount(operands, ["relative12bits"]);
    const absoluteAddress = operands[0]!;
    convert.check("relative12bits", absoluteAddress);
    const operationBit = mapping.get(mnemonic)!;
    return template(`110${operationBit}_kkkk kkkk_kkkk`, [
        ["k", convert.numeric("relative12bits", absoluteAddress)]
    ]);
};
