import type { OperandConverter } from "../../operands/mod.ts";
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
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        operands.checkCount(line.operands, ["port", "bitIndex"]);
        const operationBits = mapping.get(line.mnemonic)!;
        return template(`1001_10${operationBits} AAAA_Abbb`, [
            ["A", operands.numeric("port", line.operands[0]!)],
            ["b", operands.numeric("bitIndex", line.operands[1]!)]
        ]);
    };
