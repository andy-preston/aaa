import { checkOperandCount, numericOperand } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { GeneratedCode } from "../translate.ts";
import { template } from "../template.ts";

const mapping: Map<string, string> = new Map([
    ["ADIW", "0"],
    ["SBIW", "1"]
]);

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    checkOperandCount(line.operands, ["registerPair", "sixBits"]);
    const operationBit = mapping.get(line.mnemonic)!;
    return template(`1001_011${operationBit} KKdd_KKKK`, [
        ["d", numericOperand("registerPair", line.operands[0]!)],
        ["K", numericOperand("sixBits", line.operands[1]!)]
    ]);
};
