import { addressingModes } from "../addressing-modes/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

export type GeneratedCode =
    | []
    | [number, number]
    | [number, number, number, number];

export const translate = (instruction: Instruction): GeneratedCode => {
    if (instruction[0] == "") {
        return [];
    }
    for (const addressingMode of addressingModes) {
        const generatedCode = addressingMode(instruction);
        if (generatedCode != null) {
            return generatedCode;
        }
    }
    throw new SyntaxError(`unknown instruction ${instruction[0]}`);
};
