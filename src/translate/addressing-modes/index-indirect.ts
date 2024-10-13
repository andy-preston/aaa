import {
    type OperandIndex,
    checkOperandCount,
    numericOperand,
    operandRangeError
} from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, [OperandIndex, OperandIndex, string]> = new Map([
    ["LD", [0, 1, "0"]],
    ["ST", [1, 0, "1"]]
]);

const indexMapping: Map<string, [string, string]> = new Map([
    ["Z", ["0", "0000"]],
    ["Z+", ["1", "0001"]],
    ["-Z", ["1", "0010"]],
    ["Y", ["0", "1000"]],
    ["Y+", ["1", "1001"]],
    ["-Y", ["1", "1010"]],
    ["X", ["1", "1100"]],
    ["X+", ["1", "1101"]],
    ["-X", ["1", "1110"]]
]);

const indexDesc = Array.from(indexMapping.keys()).join(", ");

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    const [registerIndex, indexIndex, secondOperationBit] =
        mapping.get(line.mnemonic)!;
    checkOperandCount(
        line.operands,
        registerIndex == 0 ? ["register", "symbolic"] : ["symbolic", "register"]
    );
    const register = numericOperand("register", line.operands[registerIndex]!);
    const index = line.operands[indexIndex]!;
    if (!indexMapping.has(index)) {
        operandRangeError("index register", indexDesc, index);
    }
    const [firstOperationBit, suffix] = indexMapping.get(index)!;
    // In the official documentation, the store operations have
    // "#### ###r rrrr ####" as their template rather than "d dddd".
    return template(
        `100${firstOperationBit}_00${secondOperationBit}d dddd_${suffix}`,
        [["d", register]]
    );
};
