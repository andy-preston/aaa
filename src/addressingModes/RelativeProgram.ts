import { relativeJump } from "../binaryMapping.ts";
import { type GeneratedCode, template } from "../binaryTemplate.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands.ts";

const mapping: Record<string, string> = {
    "RCALL": "1",
    "RJMP":  "0",
};

export const encode = (
    instruction: Instruction,
    programCounter: number
): GeneratedCode | undefined => {
    if (!(instruction.mnemonic in mapping)) {
        return undefined;
    }
    checkCount(instruction.operands, ["relativeAddress"]);
    check("relativeAddress", 0, instruction.operands[0]!);
    const operationBit = mapping[instruction.mnemonic]!;
    return template(`110${operationBit}_kkkk_kkkk_kkkk`, {
        "k": relativeJump(instruction.operands[0]!, 12, programCounter)
    });
};
