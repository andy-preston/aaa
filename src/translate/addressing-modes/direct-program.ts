import type { Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, string> = new Map([
    ["CALL", "1"],
    ["JMP", "0"]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }

        operands.checkCount(line.operands, ["address"]);

        const address = operands.numeric("address", line.operands[0]!);
        if (address.which == "errors") {
            return address;
        }

        const operationBit = mapping.get(line.mnemonic)!;

        return template(
            `1001_010k kkkk_11${operationBit}k kkkk_kkkk kkkk_kkkk`,
            [["k", address.value]]
        );
    };
