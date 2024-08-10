import { type GeneratedCode, template } from "../generate/mod.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands/mod.ts";

const mapping: Map<string, string> = new Map([
    ["SBI", "10"],
    ["SBIC", "01"],
    ["SBIS", "11"],
    ["CBI", "00"]
]);

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    checkCount(instruction.operands, ["port", "bitIndex"]);
    check("port", 0, instruction.operands[0]!);
    check("bitIndex", 1, instruction.operands[1]!);
    const operationBits = mapping.get(instruction.mnemonic)!;
    return template(`1001_10${operationBits} AAAA_Abbb`, [
        ["A", instruction.operands[0]!],
        ["b", instruction.operands[1]!]
    ]);
};
