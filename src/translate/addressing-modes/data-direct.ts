import type { OperandConverter, OperandIndex } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { State } from "../../state/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["LDS", ["0", 0, 1]],
    ["STS", ["1", 1, 0]]
]);

export const encode = (operands: OperandConverter, state: State) =>
    (line: Line): OptionalCode => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        const [operationBit, registerIndex, addressIndex] =
            mapping.get(line.mnemonic)!;
        const hasReducedCore = state.device.hasReducedCore();

        const registerType = hasReducedCore
            ? "immediateRegister" : "register";
        const addressType = hasReducedCore
            ? "dataAddress7Bit" : "dataAddress16Bit";
        const prefix = hasReducedCore
            ? "1010_" : "1001_00";
        const suffix = hasReducedCore
            ? "kkk dddd_kkkk" : "d dddd_0000 kkkk_kkkk kkkk_kkkk";

        operands.checkCount(
            line.operands,
            registerIndex == 0
                ? [registerType, addressType]
                : [addressType, registerType]
        );
        return template(`${prefix}${operationBit}${suffix}`, [
            ["d", operands.numeric(registerType, line.operands[registerIndex]!)],
            ["k", operands.numeric(addressType, line.operands[addressIndex]!)]
        ]);
    };
