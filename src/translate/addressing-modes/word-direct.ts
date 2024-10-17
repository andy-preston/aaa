import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

export const encode = (operands: OperandConverter) =>
    (line: Line): OptionalCode => {
        if (line.mnemonic != "MOVW") {
            return undefined;
        }
        operands.checkCount(
            line.operands,
            ["anyRegisterPair", "anyRegisterPair"]
        );
        return template("0000_0001 dddd_rrrr", [
            ["d", operands.numeric("anyRegisterPair", line.operands[0]!)],
            ["r", operands.numeric("anyRegisterPair", line.operands[1]!)]
        ]);
    };
