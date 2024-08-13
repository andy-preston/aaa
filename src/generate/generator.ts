import { addressingModes } from "../addressing-modes/mod.ts";
import type { ContextHandler } from "../context/mod.ts";
import { operandConverter } from "../operands/mod.ts";
import type { Tokens } from "../tokens/tokens.ts";
import type { GeneratedCode } from "./types.ts";

export type GeneratorFunction = (tokens: Tokens) => GeneratedCode;

export const generator = (context: ContextHandler): GeneratorFunction => {
    const converter = operandConverter(context);

    return (tokens: Tokens): GeneratedCode => {
        context.label(tokens[0]!);
        for (const addressingMode of addressingModes) {
            const generatedCode = addressingMode(
                tokens[1]!.toUpperCase(),
                tokens[2],
                converter
            );
            if (generatedCode != null) {
                context.step(generatedCode);
                return generatedCode;
            }
        }
        throw SyntaxError(`unknown instruction ${tokens[1]!}`);
    };
};
