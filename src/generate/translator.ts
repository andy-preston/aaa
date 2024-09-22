import { addressingModes } from "../addressing-modes/mod.ts";
import type { OurContext } from "../context/mod.ts";
import type { OperandConverter } from "../operands/mod.ts";
import type { Instruction } from "../source-line/mod.ts";
import type { GeneratedCode } from "./types.ts";

export const translator = (
    ourContext: OurContext,
    operandConverter: OperandConverter
) => (instruction: Instruction): GeneratedCode => {
        if (instruction[0] == "") {
            return [];
        }
        for (const addressingMode of addressingModes) {
            const generatedCode = addressingMode(
                instruction,
                operandConverter,
                ourContext
            );
            if (generatedCode != null) {
                return generatedCode;
            }
        }
        throw new SyntaxError(`unknown instruction ${instruction[0]}`);
    };

export type Translate = ReturnType<typeof translator>;
