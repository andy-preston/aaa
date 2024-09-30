import { type GeneratedCode, template } from "../process/mod.ts";
import {
    type OperandIndex,
    checkOperandCount,
    numericOperand
} from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["IN", ["0", 0, 1]],
    ["OUT", ["1", 1, 0]]
]);

export const encode = (instruction: Instruction): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const [operationBit, register, port] = mapping.get(mnemonic)!;
    checkOperandCount(
        operands,
        register == 0 ? ["register", "port"] : ["port", "register"]
    );
    return template(`1011_${operationBit}AAd dddd_AAAA`, [
        ["d", numericOperand("register", operands[register]!)],
        ["A", numericOperand("port", operands[port]!)]
    ]);
};
