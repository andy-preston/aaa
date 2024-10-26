import { IOPortOutOfRange } from "../../errors/errors.ts";
import type { Errors } from "../../errors/result.ts";
import type { OperandConverter, SymbolicOperand } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, string> = new Map([
    ["SBI", "10"],
    ["SBIC", "01"],
    ["SBIS", "11"],
    ["CBI", "00"]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }

        operands.checkCount(line.operands, ["port", "bitIndex"]);

        const port = operands.numeric("port", line.operands[0]!);
        if (port.which == "errors") {
            return port;
        }

        const bitIndex = operands.numeric("bitIndex", line.operands[1]!);
        if (bitIndex.which == "errors") {
            return bitIndex;
        }

        const operationBits = mapping.get(line.mnemonic)!;

        return template(`1001_10${operationBits} AAAA_Abbb`, [
            ["A", port.value],
            ["b", bitIndex.value]
        ]);
    };
