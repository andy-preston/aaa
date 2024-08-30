import { type GeneratedCode, template } from "../generate/mod.ts";
import {
    type OperandConverter,
    type OperandIndex,
    type SymbolicOperands,
    operandMessage
} from "../operands/mod.ts";
import type { Mnemonic } from "../tokens/mod.ts";

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

export const encode = (
    mnemonic: Mnemonic,
    operands: SymbolicOperands,
    convert: OperandConverter
): GeneratedCode | undefined => {
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const [registerIndex, indexIndex, offsetIndex, firstOperationBit] =
        mapping.get(mnemonic)!;
    convert.checkCount(
        operands,
        registerIndex == 0
            ? ["register", "symbolic", "sixBits"]
            : ["symbolic", "sixBits", "register"]
    );
    const register = convert.numeric("register", operands[registerIndex]!);
    const offset = convert.numeric("sixBits", operands[offsetIndex]!);
    const index = operands[indexIndex]!;
    if (!indexMapping.has(index)) {
        throw new SyntaxError(operandMessage(indexDesc, index));
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
