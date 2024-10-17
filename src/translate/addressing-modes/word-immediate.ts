import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

const mapping: Map<string, string> = new Map([
    ["ADIW", "0"],
    ["SBIW", "1"]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): OptionalCode => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        operands.checkCount(line.operands, ["registerPair", "sixBits"]);
        const operationBit = mapping.get(line.mnemonic)!;
        return template(`1001_011${operationBit} KKdd_KKKK`, [
            ["d", operands.numeric("registerPair", line.operands[0]!)],
            ["K", operands.numeric("sixBits", line.operands[1]!)]
        ]);
    };
