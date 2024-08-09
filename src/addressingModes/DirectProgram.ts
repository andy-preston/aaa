import { type GeneratedCode, template } from "../binaryTemplate.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands.ts";

const mapping: Map<string, string> = new Map([
    ["CALL", "1"],
    ["JMP", "0"],
]);

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    checkCount(instruction.operands, ["address"]);
    check("address", 0, instruction.operands[0]!);
    const operationBit = mapping.get(instruction.mnemonic)!;
    return template(
        `1001_010k_kkkk_11${operationBit}k_kkkk_kkkk_kkkk_kkkk`,
        { "k": instruction.operands[0]! }
    );
};
