import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

const mapping: Map<string, string> = new Map([
    ["CALL", "1"],
    ["JMP", "0"]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): OptionalCode => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        operands.checkCount(line.operands, ["address"]);
        const operationBit = mapping.get(line.mnemonic)!;
        return template(`1001_010k kkkk_11${operationBit}k kkkk_kkkk kkkk_kkkk`, [
            ["k", operands.numeric("address", line.operands[0]!)]
        ]);
    };
