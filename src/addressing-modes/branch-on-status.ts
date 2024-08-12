import { type GeneratedCode, template } from "../generate/mod.ts";
import type { Instruction } from "../instruction/mod.ts";
import { check, checkCount, relativeJump } from "../operands/mod.ts";

const mapping: Map<string, [string, number?]> = new Map([
    ["BRBC", ["1", undefined]],
    ["BRSH", ["1", 0]],
    ["BRCC", ["1", 0]],
    ["BRNE", ["1", 1]],
    ["BRPL", ["1", 2]],
    ["BRVC", ["1", 3]],
    ["BRGE", ["1", 4]],
    ["BRHC", ["1", 5]],
    ["BRTC", ["1", 6]],
    ["BRID", ["1", 7]],
    ["BRBS", ["0", undefined]],
    ["BRCS", ["0", 0]],
    ["BRLO", ["0", 0]],
    ["BREQ", ["0", 1]],
    ["BRMI", ["0", 2]],
    ["BRVS", ["0", 3]],
    ["BRLT", ["0", 4]],
    ["BRHS", ["0", 5]],
    ["BRTS", ["0", 6]],
    ["BRIE", ["0", 7]]
]);

export const encode = (
    instruction: Instruction,
    programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    const [operationBit, impliedOperand] = mapping.get(instruction.mnemonic)!;
    checkCount(
        instruction.operands,
        impliedOperand == undefined
            ? ["bitIndex", "relativeAddress"]
            : ["relativeAddress"]
    );
    const bit =
        impliedOperand == undefined ? instruction.operands[0]! : impliedOperand;
    const jumpAddress =
        impliedOperand == undefined
            ? instruction.operands[1]
            : instruction.operands[0];
    check("bitIndex", 0, bit!);
    check("relativeAddress", impliedOperand == undefined ? 1 : 0, jumpAddress!);
    return template(`1111_0${operationBit}kk kkkk_ksss`, [
        ["s", bit],
        ["k", relativeJump(jumpAddress!, 7, programCounter)]
    ]);
};
