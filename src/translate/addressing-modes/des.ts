import { checkOperandCount, numericOperand } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { GeneratedCode } from "../translate.ts";
import { template } from "../template.ts";

export const encode = (line: Line): GeneratedCode | undefined => {
    if (line.mnemonic != "DES") {
        return undefined;
    }
    checkOperandCount(line.operands, ["nybble"]);
    const nybble = numericOperand("nybble", line.operands[0]!);
    return template("1001_0100 KKKK_1011", [["K", nybble]]);
};
