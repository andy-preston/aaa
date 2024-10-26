import { IOPortOutOfRange } from "../../errors/errors.ts";
import type { Errors } from "../../errors/result.ts";
import type {OperandConverter, OperandIndex, SymbolicOperand } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["IN", ["0", 0, 1]],
    ["OUT", ["1", 1, 0]]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }

        const [operationBit, registerPosition, portPosition] = mapping.get(
            line.mnemonic
        )!;

        operands.checkCount(
            line.operands,
            registerPosition == 0 ? ["register", "port"] : ["port", "register"]
        );

        const register = operands.numeric(
            "register",
            line.operands[registerPosition]!
        );
        if (register.which == "errors") {
            return register;
        }

        const port = operands.numeric("port", line.operands[portPosition]!);
        if (port.which == "errors") {
            return port;
        }

        return template(`1011_${operationBit}AAd dddd_AAAA`, [
            ["d", register.value],
            ["A", port.value]
        ]);
    };
