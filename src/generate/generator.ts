import { addressingModes } from "../addressing-modes/mod.ts";
import type { OurContext } from "../context/mod.ts";
import { operandConverter } from "../operands/mod.ts";
import type { Instruction } from "../source-line/mod.ts";
import type { GeneratedCode } from "./types.ts";

export const generator = (ourContext: OurContext) => {
    const converter = operandConverter(ourContext);

    return (instruction: Instruction): GeneratedCode => {
        if (instruction[0] == "") {
            return [];
        }
        for (const addressingMode of addressingModes) {
            const generatedCode = addressingMode(
                instruction,
                converter,
                ourContext
            );
            if (generatedCode != null) {
                ourContext.programMemoryStep(generatedCode);
                return generatedCode;
            }
        }
        throw new SyntaxError(`unknown instruction ${instruction[0]}`);
    };
};

export type Generate = ReturnType<typeof generator>;
