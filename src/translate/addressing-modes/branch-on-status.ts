import { checkOperandCount, numericOperand } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, [string, number?]> = new Map([
    ["BRBC", ["1", undefined]],
    ["BRSH", ["1", 0]],
    ["BRCC", ["1", 0]],
    ["BRNE", ["1", 1]],
    ["BRPL", ["1", 2]],
    ["BRVC", ["1", 3]],
    ["BRGE", ["1", 4]],
    ["BRHC", ["1", 5]],
    ["BRTC", ["1", 6]],
    ["BRID", ["1", 7]],
    ["BRBS", ["0", undefined]],
    ["BRCS", ["0", 0]],
    ["BRLO", ["0", 0]],
    ["BREQ", ["0", 1]],
    ["BRMI", ["0", 2]],
    ["BRVS", ["0", 3]],
    ["BRLT", ["0", 4]],
    ["BRHS", ["0", 5]],
    ["BRTS", ["0", 6]],
    ["BRIE", ["0", 7]]
]);

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    const [operationBit, impliedOperand] = mapping.get(line.mnemonic)!;
    checkOperandCount(
        line.operands,
        impliedOperand == undefined
            ? ["bitIndex", "relativeBranch"]
            : ["relativeBranch"]
    );
    const bit =
        impliedOperand == undefined
            ? numericOperand("bitIndex", line.operands[0]!)
            : impliedOperand;
    const branchTarget = line.operands[impliedOperand == undefined ? 1 : 0]!;
    return template(`1111_0${operationBit}kk kkkk_ksss`, [
        ["s", bit],
        ["k", numericOperand("relativeBranch", branchTarget)]
    ]);
};
