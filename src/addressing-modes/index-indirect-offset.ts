import { type GeneratedCode, template } from "../process/mod.ts";
import {
checkOperandCount,
    numericOperand,
    type OperandIndex,
    operandMessage
} from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

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

export const encode = (instruction: Instruction): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const [registerIndex, indexIndex, offsetIndex, firstOperationBit] =
        mapping.get(mnemonic)!;
    checkOperandCount(
        operands,
        registerIndex == 0
            ? ["register", "symbolic", "sixBits"]
            : ["symbolic", "sixBits", "register"]
    );
    const register = numericOperand("register", operands[registerIndex]!);
    const offset = numericOperand("sixBits", operands[offsetIndex]!);
    const index = operands[indexIndex]!;
    if (!indexMapping.has(index)) {
        throw new SyntaxError(
            operandMessage("index register", indexDesc, index)
        );
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
