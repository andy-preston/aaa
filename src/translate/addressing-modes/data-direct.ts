import type { Errors } from "../../errors/result.ts";
import type { OperandConverter, OperandIndex } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { State } from "../../state/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["LDS", ["0", 0, 1]],
    ["STS", ["1", 1, 0]]
]);

const options = (hasReducedCore: boolean): [string, string, string, string] =>
    hasReducedCore ? [
        "immediateRegister",
        "dataAddress7Bit",
        "1010_",
        "kkk dddd_kkkk"
    ] : [
        "register",
        "dataAddress16Bit",
        "1001_00",
        "d dddd_0000 kkkk_kkkk kkkk_kkkk"
    ];

export const encode = (operands: OperandConverter, state: State) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        const [operationBit, registerIndex, addressIndex] =
            mapping.get(line.mnemonic)!;
        const [registerType, addressType, prefix, suffix] =
            options(state.device.hasReducedCore());

        operands.checkCount(
            line.operands,
            registerIndex == 0
                ? [registerType, addressType]
                : [addressType, registerType]
        );

        const register = operands.numeric(
            registerType,
            line.operands[registerIndex]!
        );
        if (register.which == "errors") {
            return register;
        }

        const address = operands.numeric(
            addressType,
            line.operands[addressIndex]!
        );
        if (address.which == "errors") {
            return address;
        }

        return template(`${prefix}${operationBit}${suffix}`, [
            ["d", register.value],
            ["k", address.value]
        ]);
    };
