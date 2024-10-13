import { type GeneratedCode, template } from "../generate/mod.ts";
import { checkOperandCount, numericOperand } from "../operands/mod.ts";
import type { Line } from "../source-code/mod.ts";

const mapping: Map<string, string> = new Map([
    ["SBI", "10"],
    ["SBIC", "01"],
    ["SBIS", "11"],
    ["CBI", "00"]
]);

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    checkOperandCount(line.operands, ["port", "bitIndex"]);
    const operationBits = mapping.get(line.mnemonic)!;
    return template(`1001_10${operationBits} AAAA_Abbb`, [
        ["A", numericOperand("port", line.operands[0]!)],
        ["b", numericOperand("bitIndex", line.operands[1]!)]
    ]);
};
