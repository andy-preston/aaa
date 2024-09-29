import { addressingModes } from "../addressing-modes/mod.ts";
import type { Instruction } from "../source-code/mod.ts";
import type { GeneratedCode } from "./generated-code.ts";

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
