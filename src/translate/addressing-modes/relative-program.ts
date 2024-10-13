import { checkOperandCount, numericOperand } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { GeneratedCode } from "../translate.ts";
import { template } from "../template.ts";

const mapping: Map<string, string> = new Map([
    ["RCALL", "1"],
    ["RJMP", "0"]
]);

export const encode = (line: Line): GeneratedCode | undefined => {
    if (!mapping.has(line.mnemonic)) {
        return undefined;
    }
    checkOperandCount(line.operands, ["relativeJump"]);
    const absoluteAddress = line.operands[0]!;
    const operationBit = mapping.get(line.mnemonic)!;
    return template(`110${operationBit}_kkkk kkkk_kkkk`, [
        ["k", numericOperand("relativeJump", absoluteAddress)]
    ]);
};
