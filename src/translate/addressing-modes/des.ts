import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

export const encode = (operands: OperandConverter) =>
    (line: Line): OptionalCode => {
        if (line.mnemonic != "DES") {
            return undefined;
        }
        operands.checkCount(line.operands, ["nybble"]);
        const nybble = operands.numeric("nybble", line.operands[0]!);
        return template("1001_0100 KKKK_1011", [["K", nybble]]);
    };
