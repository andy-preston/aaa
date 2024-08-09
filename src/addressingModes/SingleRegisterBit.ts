import { type GeneratedCode, template } from "../binaryTemplate.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands.ts";

const mapping: Map<string, string> = new Map([
    ["BLD",  "00"],
    ["BST",  "01"],
    ["SBRC", "10"],
    ["SBRS", "11"]
]);

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    checkCount(instruction.operands, ["register", "bitIndex"]);
    check("register", 0, instruction.operands[0]!);
    check("bitIndex", 1, instruction.operands[1]!);
    const operationBits = mapping.get(instruction.mnemonic)!;
    // In the official documentation, some of these have
    // "#### ###r rrrr #bbb" as their template rather than "d dddd".
    // e.g. `BLD Rd, b` has "d dddd" but `SBRS Rd, b` has "r rrrr".
    return template(`1111_1${operationBits}d dddd_0bbb`, new Map([
        ["d", instruction.operands[0]!],
        ["b", instruction.operands[1]!]
    ]));
};
