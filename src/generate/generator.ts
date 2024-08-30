import { addressingModes } from "../addressing-modes/mod.ts";
import type { OurContext } from "../context/mod.ts";
import { operandConverter } from "../operands/mod.ts";
import type { Tokens } from "../tokens/mod.ts";
import type { GeneratedCode } from "./types.ts";

export const createGenerator = (ourContext: OurContext) => {
    const converter = operandConverter(ourContext);

    return (tokens: Tokens): GeneratedCode => {
        ourContext.label(tokens[0]!);
        const mnemonic = tokens[1]!.toUpperCase();
        if (mnemonic == "") {
            return [];
        }
        for (const addressingMode of addressingModes) {
            const generatedCode = addressingMode(
                mnemonic,
                tokens[2],
                converter
            );
            if (generatedCode != null) {
                ourContext.flashStep(generatedCode);
                return generatedCode;
            }
        }
        throw SyntaxError(`unknown instruction ${mnemonic}`);
    };
};

export type Generate = ReturnType<typeof createGenerator>;
