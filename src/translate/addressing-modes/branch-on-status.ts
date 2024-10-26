import type { Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
import { numericOperand } from "../../operands/numeric.ts";
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

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }

        const [operationBit, impliedOperand] = mapping.get(line.mnemonic)!;

        operands.checkCount(
            line.operands,
            impliedOperand == undefined
                ? ["bitIndex", "relativeBranch"]
                : ["relativeBranch"]
        );

        const bit = impliedOperand == undefined
            ? operands.numeric("bitIndex", line.operands[0]!)
            : numericOperand(impliedOperand);
        if (bit.which == "errors") {
            return bit;
        }

        const branchTarget = operands.numeric(
            "relativeBranch",
            line.operands[impliedOperand == undefined ? 1 : 0]!
        );
        if (branchTarget.which == "errors") {
            return branchTarget;
        }

        return template(`1111_0${operationBit}kk kkkk_ksss`, [
            ["s", bit.value],
            ["k", branchTarget.value]
        ]);
    };
