import {
    type OperandIndex,
    checkOperandCount,
    numericOperand
} from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["IN", ["0", 0, 1]],
    ["OUT", ["1", 1, 0]]
]);

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    const [operationBit, register, port] = mapping.get(line.mnemonic)!;
    checkOperandCount(
        line.operands,
        register == 0 ? ["register", "port"] : ["port", "register"]
    );
    return template(`1011_${operationBit}AAd dddd_AAAA`, [
        ["d", numericOperand("register", line.operands[register]!)],
        ["A", numericOperand("port", line.operands[port]!)]
    ]);
};
