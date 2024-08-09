import { relativeJump } from "../binaryMapping.ts";
import { type GeneratedCode, template } from "../generated-code.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands.ts";

const mapping: Map<string, string> = new Map([
    ["RCALL", "1"],
    ["RJMP", "0"]
]);

export const encode = (
    instruction: Instruction,
    programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    checkCount(instruction.operands, ["relativeAddress"]);
    check("relativeAddress", 0, instruction.operands[0]!);
    const operationBit = mapping.get(instruction.mnemonic)!;
    return template(
        `110${operationBit}_kkkk kkkk_kkkk`,
        new Map([
            ["k", relativeJump(instruction.operands[0]!, 12, programCounter)]
        ])
    );
};
