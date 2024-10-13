import {
    checkOperandCount,
    numericOperand,
    operandRangeError,
    type OperandIndex,
} from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { GeneratedCode } from "../translate.ts";
import { template } from "../template.ts";

const mapping: Map<string, [OperandIndex, OperandIndex, OperandIndex, string]> =
    new Map([
        ["LDD", [0, 1, 2, "0"]],
        ["STD", [2, 0, 1, "1"]]
    ]);

const indexMapping: Map<string, string> = new Map([
    ["Z+", "0"],
    ["Y+", "1"]
]);

const indexDesc = Array.from(indexMapping.keys()).join(", ");

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    const [registerIndex, indexIndex, offsetIndex, firstOperationBit] =
        mapping.get(line.mnemonic)!;
    checkOperandCount(
        line.operands,
        registerIndex == 0
            ? ["register", "symbolic", "sixBits"]
            : ["symbolic", "sixBits", "register"]
    );
    const register = numericOperand("register", line.operands[registerIndex]!);
    const offset = numericOperand("sixBits", line.operands[offsetIndex]!);
    const index = line.operands[indexIndex]!;
    if (!indexMapping.has(index)) {
        operandRangeError("index register", indexDesc, index);
    }
    const secondOperationBit = indexMapping.get(index)!;
    // In the official documentation, the store operations have
    // "#### ###r rrrr ####" as their template rather than "d dddd".
    // e.g. `LDD Rd, Y` has "d dddd" but `STD Rd, Y` has "r rrrr".
    return template(
        `10q0_qq${firstOperationBit}d dddd_${secondOperationBit}qqq`,
        [
            ["d", register],
            ["q", offset]
        ]
    );
};
