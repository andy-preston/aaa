import { addressingModes } from "../addressing-modes/mod.ts";
import type { ContextHandler } from "../context/mod.ts";
import type { Instruction } from "../instruction/mod.ts";
import type { GeneratedCode } from "./types.ts";

export const generator = (contextHandler: ContextHandler) => {
    return (instruction: Instruction): GeneratedCode => {
        for (const addressingMode of addressingModes) {
            const generatedCode = addressingMode(...instruction);
            if (generatedCode != null) {
                contextHandler.step(generatedCode);
                return generatedCode;
            }
        }
        throw SyntaxError(`unknown instruction ${instruction[0]!}`);
    };
};
