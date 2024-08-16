import type { Instruction } from "../instruction.ts";
import { type GeneratedCode, template } from "../generate/mod.ts";
import { check, checkCount, OperandIndex } from "../operands/mod.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["IN", ["0", 0, 1]],
    ["OUT", ["1", 1, 0]]
]);

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    const [operationBit, registerIndex, portIndex] =
        mapping.get(instruction.mnemonic)!;
    checkCount(
        instruction.operands,
        registerIndex < portIndex ? ["register", "port"] : ["port", "register"]
    );
    const register = instruction.operands[registerIndex]!;
    const port = instruction.operands[portIndex]!;
    check("register", registerIndex, register);
    check("port", portIndex, port);
    return template(`1011_${operationBit}AAd dddd_AAAA`, [
        ["d", register],
        ["A", port]
    ]);
};
