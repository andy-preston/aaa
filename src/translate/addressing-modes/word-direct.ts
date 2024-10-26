import type { Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (line.mnemonic != "MOVW") {
            return undefined;
        }

        operands.checkCount(
            line.operands,
            ["anyRegisterPair", "anyRegisterPair"]
        );

        const firstPair = operands.numeric("anyRegisterPair", line.operands[0]!);
        if (firstPair.which == "errors") {
            return firstPair;
        }

        const secondPair = operands.numeric("anyRegisterPair", line.operands[1]!);
        if (secondPair.which == "errors") {
            return secondPair;
        }

        return template("0000_0001 dddd_rrrr", [
            ["d", firstPair.value],
            ["r", secondPair.value]
        ]);
    };
