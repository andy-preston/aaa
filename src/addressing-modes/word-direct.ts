import { type GeneratedCode, template } from "../generate/mod.ts";
import { checkOperandCount, numericOperand } from "../operands/mod.ts";
import type { Line } from "../source-code/mod.ts";

export const encode = (line: Line): GeneratedCode | undefined => {
    if (line.mnemonic != "MOVW") {
        return undefined;
    }
    checkOperandCount(line.operands, ["anyRegisterPair", "anyRegisterPair"]);
    return template("0000_0001 dddd_rrrr", [
        ["d", numericOperand("anyRegisterPair", line.operands[0]!)],
        ["r", numericOperand("anyRegisterPair", line.operands[1]!)]
    ]);
};
