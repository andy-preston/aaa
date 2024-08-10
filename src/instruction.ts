import { addressingModes } from "./addressingModes/mod.ts";
import type { GeneratedCode } from "./generated-code.ts";
import type { Operands } from "./operands/mod.ts";

export type Instruction = {
    "mnemonic": string;
    "operands": Operands;
};

export const instruction = (mnemonic: string, operands: Operands) => ({
    "mnemonic": mnemonic,
    "operands": operands
});

export const encode = (
    instruction: Instruction,
    programCounter: number
): GeneratedCode => {
    for (const addressingMode of addressingModes) {
        const generatedCode = addressingMode(instruction, programCounter);
        if (generatedCode != null) {
            return generatedCode;
        }
    }
    throw `unknown instruction ${instruction.mnemonic}`;
};
