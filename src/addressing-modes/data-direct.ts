import type { OurContext } from "../context/mod.ts";
import { type GeneratedCode, template } from "../generate/mod.ts";
import type {
    OperandConverter,
    OperandIndex,
    TypeName
} from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["LDS", ["0", 0, 1]],
    ["STS", ["1", 1, 0]]
]);

export const encode = (
    instruction: Instruction,
    convert: OperandConverter,
    ourContext: OurContext
): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const [operationBit, registerIndex, addressIndex] = mapping.get(mnemonic)!;

    const registerType: TypeName = ourContext.reducedCore
        ? "immediateRegister" : "register";
    const addressType: TypeName = ourContext.reducedCore
        ? "7bitAddress" : "16bitAddress";
    const prefix = ourContext.reducedCore ? "1010_" : "1001_00";
    const suffix = ourContext.reducedCore
        ? "kkk dddd_kkkk" : "d dddd_0000 kkkk_kkkk kkkk_kkkk";

    convert.checkCount(
        operands,
        registerIndex == 0
            ? [registerType, addressType]
            : [addressType, registerType]
    );
    return template(`${prefix}${operationBit}${suffix}`, [
        ["d", convert.numeric(registerType, operands[registerIndex]!)],
        ["k", convert.numeric(addressType, operands[addressIndex]!)]
    ]);
};
