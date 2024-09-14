import { addressingModes } from "../addressing-modes/mod.ts";
import type { OurContext } from "../context/mod.ts";
import { operandConverter } from "../operands/mod.ts";
import type { Instruction } from "../source-line/mod.ts";
import type { GeneratedCode } from "./types.ts";

export const generator = (ourContext: OurContext) => {
    const converter = operandConverter(ourContext);

    return (instruction: Instruction): GeneratedCode => {
        const mnemonic = instruction[0]!.toUpperCase();
        if (mnemonic == "") {
            return [];
        }
        for (const addressingMode of addressingModes) {
            const generatedCode = addressingMode(
                mnemonic,
                instruction[1],
                converter
            );
            if (generatedCode != null) {
                ourContext.flashStep(generatedCode);
                return generatedCode;
            }
        }
        throw new SyntaxError(`unknown instruction ${mnemonic}`);
    };
};

export type Generate = ReturnType<typeof generator>;
