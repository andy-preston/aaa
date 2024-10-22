import { IOPortOutOfRange } from "../../errors/errors.ts";
import type { OperandConverter, SymbolicOperand } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

const mapping: Map<string, string> = new Map([
    ["SBI", "10"],
    ["SBIC", "01"],
    ["SBIS", "11"],
    ["CBI", "00"]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): OptionalCode => {
        const portAddress = (operand: SymbolicOperand) => {
            try {
                return operands.numeric("port", operand);
            } catch (error) {
                if (error instanceof IOPortOutOfRange) {
                    error.hinting(line.mnemonic)
                }
                throw error;
            }
        };

        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        operands.checkCount(line.operands, ["port", "bitIndex"]);
        const operationBits = mapping.get(line.mnemonic)!;
        return template(`1001_10${operationBits} AAAA_Abbb`, [
            ["A", portAddress(line.operands[0]!)],
            ["b", operands.numeric("bitIndex", line.operands[1]!)]
        ]);
    };
