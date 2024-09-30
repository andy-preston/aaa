import { hasReducedCore } from "../context/mod.ts";
import { type GeneratedCode, template } from "../process/mod.ts";
import {
    checkOperandCount,
    numericOperand,
    type OperandIndex,
    type TypeName
} from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["LDS", ["0", 0, 1]],
    ["STS", ["1", 1, 0]]
]);

export const encode = (instruction: Instruction): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const [operationBit, registerIndex, addressIndex] = mapping.get(mnemonic)!;

    const registerType: TypeName = hasReducedCore()
        ? "immediateRegister" : "register";
    const addressType: TypeName = hasReducedCore()
        ? "7bitAddress" : "16bitAddress";
    const prefix = hasReducedCore() ? "1010_" : "1001_00";
    const suffix = hasReducedCore()
        ? "kkk dddd_kkkk" : "d dddd_0000 kkkk_kkkk kkkk_kkkk";

    checkOperandCount(
        operands,
        registerIndex == 0
            ? [registerType, addressType]
            : [addressType, registerType]
    );
    return template(`${prefix}${operationBit}${suffix}`, [
        ["d", numericOperand(registerType, operands[registerIndex]!)],
        ["k", numericOperand(addressType, operands[addressIndex]!)]
    ]);
};
