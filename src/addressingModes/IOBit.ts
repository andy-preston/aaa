import { type GeneratedCode, template } from "../binaryTemplate.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands.ts";

const mappings: Record<string, string> = {
    "SBI":  "10",
    "SBIC": "01",
    "SBIS": "11",
    "CBI":  "00",
};

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | null => {
    if (!(instruction.mnemonic in mappings)) {
        return null;
    }
    checkCount(instruction.operands, ["port", "bitIndex"]);
    check("port", 0, instruction.operands[0]!);
    check("bitIndex", 1, instruction.operands[1]!);
    const operationBits = mappings[instruction.mnemonic]!;
    return template(`1001_10${operationBits}_AAAA_Abbb`, {
        "A": instruction.operands[0],
        "b": instruction.operands[1]
    });
};
