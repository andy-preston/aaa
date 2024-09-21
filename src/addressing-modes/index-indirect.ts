import type { OurContext } from "../context/mod.ts";
import { type GeneratedCode, template } from "../generate/mod.ts";
import {
    type OperandConverter,
    type OperandIndex,
    operandMessage
} from "../operands/mod.ts";
import type { Instruction } from "../source-line/mod.ts";

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

export const encode = (
    instruction: Instruction,
    convert: OperandConverter,
    _ourContext: OurContext
): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const [registerIndex, indexIndex, secondOperationBit] =
        mapping.get(mnemonic)!;
    convert.checkCount(
        operands,
        registerIndex == 0 ? ["register", "symbolic"] : ["symbolic", "register"]
    );
    const register = convert.numeric("register", operands[registerIndex]!);
    const index = operands[indexIndex]!;
    if (!indexMapping.has(index)) {
        throw new SyntaxError(
            operandMessage("index register", indexDesc, index)
        );
    }
    const [firstOperationBit, suffix] = indexMapping.get(index)!;
    // In the official documentation, the store operations have
    // "#### ###r rrrr ####" as their template rather than "d dddd".
    return template(
        `100${firstOperationBit}_00${secondOperationBit}d dddd_${suffix}`,
        [["d", register]]
    );
};
