import type { Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, string> = new Map([
    ["BREAK", "1001_0101 1001_1000"],
    ["NOP", "0000_0000 0000_0000"],
    ["RET", "1001_0101 0000_1000"],
    ["RETI", "1001_0101 0001_1000"],
    ["SLEEP", "1001_0101 1000_1000"],
    ["WDR", "1001_0101 1010_1000"],
    // Indirect Program Addressing
    ["IJMP", "1001_0100 0000_1001"],
    ["EIJMP", "1001_0100 0001_1001"],
    ["ICALL", "1001_0101 0000_1001"],
    ["EICALL", "1001_0101 0001_1001"]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }

        operands.checkCount(line.operands, []);

        return template(mapping.get(line.mnemonic)!, []);
    };
