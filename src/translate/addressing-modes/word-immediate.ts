import type { Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, string> = new Map([
    ["ADIW", "0"],
    ["SBIW", "1"]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }

        operands.checkCount(line.operands, ["registerPair", "sixBits"]);

        const registerPair = operands.numeric("registerPair", line.operands[0]!);
        if (registerPair.which == "errors") {
            return registerPair;
        }

        const numeric = operands.numeric("sixBits", line.operands[1]!);
        if (numeric.which == "errors") {
            return numeric;
        }

        const operationBit = mapping.get(line.mnemonic)!;

        return template(`1001_011${operationBit} KKdd_KKKK`, [
            ["d", registerPair.value],
            ["K", numeric.value]
        ]);
    };
