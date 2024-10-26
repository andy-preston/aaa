import type { Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (line.mnemonic != "DES") {
            return undefined;
        }

        operands.checkCount(line.operands, ["nybble"]);

        const nybble = operands.numeric("nybble", line.operands[0]!);
        if (nybble.which == "errors") {
            return nybble;
        }

        return template("1001_0100 KKKK_1011", [["K", nybble.value]]);
    };
