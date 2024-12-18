import type { Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
import { numericOperand } from "../../operands/numeric.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, [string, number?]> = new Map([
    ["BCLR", ["1", undefined]],
    ["CLC", ["1", 0]],
    ["CLZ", ["1", 1]],
    ["CLN", ["1", 2]],
    ["CLV", ["1", 3]],
    ["CLS", ["1", 4]],
    ["CLH", ["1", 5]],
    ["CLT", ["1", 6]],
    ["CLI", ["1", 7]],
    ["BSET", ["0", undefined]],
    ["SEC", ["0", 0]],
    ["SEZ", ["0", 1]],
    ["SEN", ["0", 2]],
    ["SEV", ["0", 3]],
    ["SES", ["0", 4]],
    ["SEH", ["0", 5]],
    ["SET", ["0", 6]],
    ["SEI", ["0", 7]]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }

        const [operationBit, impliedOperand] = mapping.get(line.mnemonic)!;

        operands.checkCount(
            line.operands,
            impliedOperand == undefined ? ["bitIndex"] : []
        );

        const operand = impliedOperand == undefined
            ? operands.numeric("bitIndex", line.operands[0]!)
            : numericOperand(impliedOperand);
        if (operand.which == "errors") {
            return operand;
        }

        return template(`1001_0100 ${operationBit}sss_1000`, [
            ["s", operand.value]
        ]);
    };
