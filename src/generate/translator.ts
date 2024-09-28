import { addressingModes } from "../addressing-modes/mod.ts";
import type {  } from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";
import type { GeneratedCode } from "./types.ts";

export const translator = () => (instruction: Instruction): GeneratedCode => {
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

export type Translate = ReturnType<typeof translator>;
