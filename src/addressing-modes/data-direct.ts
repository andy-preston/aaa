import { type GeneratedCode, template } from "../generate/mod.ts";
import {
    type CheckName,
    type NumericOperand,
    type OperandConverter,
    type OperandIndex,
    type SymbolicOperands,
    checkCount
} from "../operands/mod.ts";
import type { Mnemonic } from "../tokens/tokens.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["LDS", ["0", 0, 1]],
    ["STS", ["1", 1, 0]]
]);

type Options = [CheckName, CheckName, () => NumericOperand, string, string];

export const encode = (
    mnemonic: Mnemonic,
    operands: SymbolicOperands,
    convert: OperandConverter
): GeneratedCode | undefined => {
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const [operationBit, registerIndex, addressIndex] = mapping.get(mnemonic)!;

    const bigRegister = (): NumericOperand =>
        convert.numeric("register", operands[registerIndex]!);

    const smallRegister = (): NumericOperand =>
        convert.immediateRegister(operands[registerIndex]!);

    const bigMode: Map<boolean, Options> = new Map([
        [ true, [
            "register" as CheckName,
            "16bitAddress" as CheckName,
            bigRegister,
            "1001_00",
            "d dddd_0000 kkkk_kkkk kkkk_kkkk"
        ]], [ false, [
            "immediateRegister" as CheckName,
            "7bitAddress" as CheckName,
            smallRegister,
            "1010_",
            "kkk dddd_kkkk"
        ]]
    ]);

    // I'm not completely sure at this point how these instructions work
    // there appear to be two versions, and I'm assuming that one operates on
    // low SRAM devices and the other operates on devices with more SRAM
    // in avrlass, he refers to the "big one" as LDS
    // and the "little one" as LDS.RC

    const [registerType, addressType, register, prefix, suffix] = bigMode.get(true)!;
    checkCount(
        operands,
        registerIndex == 0
            ? [registerType, addressType]
            : [addressType, registerType]
    );
    return template(`${prefix}${operationBit}${suffix}`, [
        ["d", register()],
        ["k", convert.numeric(addressType, operands[addressIndex]!)]
    ]);
};
