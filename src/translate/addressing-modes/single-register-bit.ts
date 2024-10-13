import { checkOperandCount, numericOperand } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, string> = new Map([
    ["BLD", "00"],
    ["BST", "01"],
    ["SBRC", "10"],
    ["SBRS", "11"]
]);

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    checkOperandCount(line.operands, ["register", "bitIndex"]);
    const operationBits = mapping.get(line.mnemonic)!;
    // In the official documentation, some of these have
    // "#### ###r rrrr #bbb" as their template rather than "d dddd".
    // e.g. `BLD Rd, b` has "d dddd" but `SBRS Rd, b` has "r rrrr".
    return template(`1111_1${operationBits}d dddd_0bbb`, [
        ["d", numericOperand("register", line.operands[0]!)],
        ["b", numericOperand("bitIndex", line.operands[1]!)]
    ]);
};
