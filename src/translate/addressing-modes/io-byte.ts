import type {OperandConverter, OperandIndex } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["IN", ["0", 0, 1]],
    ["OUT", ["1", 1, 0]]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): OptionalCode => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        const [operationBit, register, port] = mapping.get(line.mnemonic)!;
        operands.checkCount(
            line.operands,
            register == 0 ? ["register", "port"] : ["port", "register"]
        );
        return template(`1011_${operationBit}AAd dddd_AAAA`, [
            ["d", operands.numeric("register", line.operands[register]!)],
            ["A", operands.numeric("port", line.operands[port]!)]
        ]);
    };
