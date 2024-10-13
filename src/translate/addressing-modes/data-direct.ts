import { hasReducedCore } from "../../context/mod.ts";
import {
    type OperandIndex, type TypeName, checkOperandCount, numericOperand
} from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { GeneratedCode } from "../translate.ts";
import { template } from "../template.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["LDS", ["0", 0, 1]],
    ["STS", ["1", 1, 0]]
]);

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    const [operationBit, registerIndex, addressIndex] =
        mapping.get(line.mnemonic)!;

    const registerType: TypeName = hasReducedCore()
        ? "immediateRegister" : "register";
    const addressType: TypeName = hasReducedCore()
        ? "dataAddress7Bit" : "dataAddress16Bit";
    const prefix = hasReducedCore() ? "1010_" : "1001_00";
    const suffix = hasReducedCore()
        ? "kkk dddd_kkkk" : "d dddd_0000 kkkk_kkkk kkkk_kkkk";

    checkOperandCount(
        line.operands,
        registerIndex == 0
            ? [registerType, addressType]
            : [addressType, registerType]
    );
    return template(`${prefix}${operationBit}${suffix}`, [
        ["d", numericOperand(registerType, line.operands[registerIndex]!)],
        ["k", numericOperand(addressType, line.operands[addressIndex]!)]
    ]);
};
