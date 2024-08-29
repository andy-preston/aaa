import { addressingModes } from "../addressing-modes/mod.ts";
import type { ContextHandler } from "../context/mod.ts";
import type { Tokens } from "../load-tokenise/mod.ts";
import { operandConverter } from "../operands/mod.ts";
import type { GeneratedCode } from "./types.ts";

export type GeneratorFunction = (tokens: Tokens) => GeneratedCode;

export const newGenerator = (context: ContextHandler): GeneratorFunction => {
    const converter = operandConverter(context);

    return (tokens: Tokens): GeneratedCode => {
        context.label(tokens[0]!);
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
                context.flashStep(generatedCode);
                return generatedCode;
            }
        }
        throw SyntaxError(`unknown instruction ${mnemonic}`);
    };
};
