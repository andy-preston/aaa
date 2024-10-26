import type { Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, string> = new Map([
    ["BLD", "00"],
    ["BST", "01"],
    ["SBRC", "10"],
    ["SBRS", "11"]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        operands.checkCount(line.operands, ["register", "bitIndex"]);
        const operationBits = mapping.get(line.mnemonic)!;

        const register = operands.numeric("register", line.operands[0]!);
        if (register.which == "errors") {
            return register;
        }

        const bitIndex = operands.numeric("bitIndex", line.operands[1]!);
        if (bitIndex.which == "errors") {
            return bitIndex;
        }

        // In the official documentation, some of these have
        // "#### ###r rrrr #bbb" as their template rather than "d dddd".
        // e.g. `BLD Rd, b` has "d dddd" but `SBRS Rd, b` has "r rrrr".
        return template(`1111_1${operationBits}d dddd_0bbb`, [
            ["d", register.value],
            ["b", bitIndex.value]
        ]);
    };
