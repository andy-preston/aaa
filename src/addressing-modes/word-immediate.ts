import { type GeneratedCode, template } from "../generate/mod.ts";
import type { Instruction } from "../instruction/mod.ts";
import { check, checkCount, registerPair } from "../operands/mod.ts";

const mapping: Map<string, string> = new Map([
    ["ADIW", "0"],
    ["SBIW", "1"]
]);

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    checkCount(
        instruction.operands,
        ["registerPair", "sixBits"]
    );
    check("registerPair", 0, instruction.operands[0]!);
    check("sixBits", 1, instruction.operands[1]!);
    const operationBit = mapping.get(instruction.mnemonic)!;
    return template(`1001_011${operationBit} KKdd_KKKK`, [
        ["d", registerPair(instruction.operands[0]!, 24)],
        ["K", instruction.operands[1]!]
    ]);
};
