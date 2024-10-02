import { type GeneratedCode, template } from "../generate/mod.ts";
import { checkOperandCount, numericOperand } from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

const mapping: Map<string, [string, string]> = new Map([
    ["POP", ["00", "1111"]],
    ["LAC", ["01", "0110"]],
    ["XCH", ["01", "0100"]],
    ["LAS", ["01", "0101"]],
    ["LAT", ["01", "0111"]],
    ["COM", ["10", "0000"]],
    ["NEG", ["10", "0001"]],
    ["SWAP", ["10", "0010"]],
    ["INC", ["10", "0011"]],
    ["ASR", ["10", "0101"]],
    ["LSR", ["10", "0110"]],
    ["ROR", ["10", "0111"]],
    ["DEC", ["10", "1010"]],
    ["PUSH", ["01", "1111"]]
]);

export const encode = (instruction: Instruction): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const usesZ = ["LAC", "LAS", "LAT", "XCH"].includes(mnemonic);
    checkOperandCount(operands, usesZ ? ["z", "register"] : ["register"]);
    if (usesZ) {
        const _ = numericOperand("z", operands[0]!);
    }
    const [operationBits, suffix] = mapping.get(mnemonic)!;
    // In the official documentation, some of these have
    // "#### ###r rrrr ####" as their template rather than "d dddd".
    // e.g. `SWAP Rd` has "d dddd" but `LAC Rd` has "r rrrr".
    return template(`1001_0${operationBits}d dddd_${suffix}`, [
        ["d", numericOperand("register", operands[usesZ ? 1 : 0]!)]
    ]);
};
