import type { OperandConverter } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

const mapping: Map<string, string> = new Map([
    ["RCALL", "1"],
    ["RJMP", "0"]
]);

export const encode = (operands: OperandConverter) =>
    (line: Line): GeneratedCode | Errors | undefined => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        operands.checkCount(line.operands, ["relativeJump"]);
        const absoluteAddress = line.operands[0]!;
        const operationBit = mapping.get(line.mnemonic)!;
        return template(`110${operationBit}_kkkk kkkk_kkkk`, [
            ["k", operands.numeric("relativeJump", absoluteAddress)]
        ]);
    };
