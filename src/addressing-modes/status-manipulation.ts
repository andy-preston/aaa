import { type GeneratedCode, template } from "../generate/mod.ts";
import type { Instruction } from "../instruction/mod.ts";
import { check, checkCount } from "../operands/mod.ts";

const mapping: Map<string, [string, number?]> = new Map([
    ["BCLR", ["1", undefined]],
    ["CLC", ["1", 0]],
    ["CLZ", ["1", 1]],
    ["CLN", ["1", 2]],
    ["CLV", ["1", 3]],
    ["CLS", ["1", 4]],
    ["CLH", ["1", 5]],
    ["CLT", ["1", 6]],
    ["CLI", ["1", 7]],
    ["BSET", ["0", undefined]],
    ["SEC", ["0", 0]],
    ["SEZ", ["0", 1]],
    ["SEN", ["0", 2]],
    ["SEV", ["0", 3]],
    ["SES", ["0", 4]],
    ["SEH", ["0", 5]],
    ["SET", ["0", 6]],
    ["SEI", ["0", 7]]
]);

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    const [operationBit, impliedOperand] = mapping.get(instruction.mnemonic)!;
    checkCount(
        instruction.operands,
        impliedOperand == undefined ? ["bitIndex"] : []
    );
    const operand =
        impliedOperand == undefined ? instruction.operands[0]! : impliedOperand;
    check("bitIndex", 0, operand);
    return template(`1001_0100 ${operationBit}sss_1000`, [
        ["s", operand]
    ]);
};
