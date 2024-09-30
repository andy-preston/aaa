import { type GeneratedCode, template } from "../process/mod.ts";
import { checkOperandCount, numericOperand } from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

export const encode = (instruction: Instruction): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (mnemonic != "DES") {
        return undefined;
    }
    checkOperandCount(operands, ["nybble"]);
    const nybble = numericOperand("nybble", operands[0]!);
    return template("1001_0100 KKKK_1011", [["K", nybble]]);
};
