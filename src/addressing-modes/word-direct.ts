import { type GeneratedCode, template } from "../process/mod.ts";
import { checkOperandCount, numericOperand } from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

export const encode = (instruction: Instruction): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (mnemonic != "MOVW") {
        return undefined;
    }
    checkOperandCount(operands, ["anyRegisterPair", "anyRegisterPair"]);
    return template("0000_0001 dddd_rrrr", [
        ["d", numericOperand("anyRegisterPair", operands[0]!)],
        ["r", numericOperand("anyRegisterPair", operands[1]!)]
    ]);
};
