import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter } from "../operands/mod.ts";
import type { Instruction } from "../source-line/mod.ts";

const mapping: Map<string, string> = new Map([
    ["BLD", "00"],
    ["BST", "01"],
    ["SBRC", "10"],
    ["SBRS", "11"]
]);

export const encode = (
    instruction: Instruction,
    convert: OperandConverter
): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    convert.checkCount(operands, ["register", "bitIndex"]);
    const operationBits = mapping.get(mnemonic)!;
    // In the official documentation, some of these have
    // "#### ###r rrrr #bbb" as their template rather than "d dddd".
    // e.g. `BLD Rd, b` has "d dddd" but `SBRS Rd, b` has "r rrrr".
    return template(`1111_1${operationBits}d dddd_0bbb`, [
        ["d", convert.numeric("register", operands[0]!)],
        ["b", convert.numeric("bitIndex", operands[1]!)]
    ]);
};
