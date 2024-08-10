import { addressingModes } from "../addressing-modes/mod.ts";
import { GeneratedCode } from "./generated-code.ts";
import { Instruction } from "../instruction.ts";

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
