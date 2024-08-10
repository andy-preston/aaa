import { type GeneratedCode, template } from "../generated-code.ts";
import type { Instruction } from "../instruction.ts";
import { check, checkCount } from "../operands/mod.ts";

const mapping: Map<string, [string, string]> = new Map([
    ["POP",     ["00", "1111"]],
    ["LAC",     ["01", "0110"]],
    ["LAS",     ["01", "0101"]],
    ["LAT",     ["01", "0111"]],
    ["COM",     ["10", "0000"]],
    ["NEG",     ["10", "0001"]],
    ["SWAP",    ["10", "0010"]],
    ["INC",     ["10", "0011"]],
    ["ASR",     ["10", "0101"]],
    ["LSR",     ["10", "0110"]],
    ["ROR",     ["10", "0111"]],
    ["DEC",     ["10", "1010"]],
    ["PUSH",    ["01", "1111"]],
]);

export const encode = (
    instruction: Instruction,
    _programCounter: number
): GeneratedCode | undefined => {
    if (!mapping.has(instruction.mnemonic)) {
        return undefined;
    }
    const usesZ = ["LAC", "LAS", "LAT"].includes(instruction.mnemonic);
    checkCount(
        instruction.operands,
        usesZ ? ["Z", "register"] : ["register"]
    );
    if (usesZ) {
        check("Z", 0, instruction.operands[0]!);
        check("register", 1, instruction.operands[1]!);
    } else {
        check("register", 0, instruction.operands[0]!);
    }
    const register = instruction.operands[usesZ ? 1 : 0]!;
    const [operationBits, suffix] = mapping.get(instruction.mnemonic)!;
    // In the official documentation, some of these have
    // "#### ###r rrrr ####" as their template rather than "d dddd".
    // e.g. `SWAP Rd` has "d dddd" but `LAC Rd` has "r rrrr".
    return template(`1001_0${operationBits}d dddd_${suffix}`, [
        ["d", register]
    ]);
};
