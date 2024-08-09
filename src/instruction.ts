import { addressingModes } from "./addressingModes/mod.ts";
import type { GeneratedCode } from "./binaryTemplate.ts";
import type { Operands } from "./operands.ts";

export type Instruction = {
    "mnemonic": string,
    "operands": Operands
};

export const instruction = (mnemonic: string, operands: Operands) =>
    ({ "mnemonic": mnemonic, "operands": operands});

export const encode = (
    instruction: Instruction,
    pc: number
): GeneratedCode => {
    for (const addressingMode of addressingModes) {
        const generatedCode = addressingMode(instruction, pc);
        if (generatedCode != null) {
            return generatedCode;
        }
    }
    throw `unknown instruction ${instruction.mnemonic}`;
};
