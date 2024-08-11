import { addressingModes } from "../addressing-modes/mod.ts";
import type { GeneratedCode } from "./generated-code.ts";
import type { ContextHandler } from "../context/mod.ts";
import { IndexingOperand, indexingOperands } from "../operands/mod.ts";

export const encoder = (contextHandler: ContextHandler) => {
    return (tokens: Array<string>): GeneratedCode => {
        contextHandler.label(tokens.shift()!);
        const programCounter = contextHandler.programCounter();
        const mnemonic = tokens.shift()!.toUpperCase();
        const numericOperands: Array<number | null> = tokens.map(
            (symbolic: string) =>
                indexingOperands.includes(symbolic as IndexingOperand)
                    ? null
                    : contextHandler.evaluate(symbolic)
        );
        const symbolicOperands: Array<string> = tokens.map(
            (symbolic: string) =>
                symbolic.indexOf(" ") == -1
                    ? symbolic.toUpperCase()
                    : symbolic
        );
        for (const addressingMode of addressingModes) {
            const generatedCode = addressingMode(
                mnemonic,
                numericOperands,
                symbolicOperands,
                programCounter
            );
            if (generatedCode != null) {
                contextHandler.step(generatedCode);
                return generatedCode;
            }
        }
        throw SyntaxError(`unknown instruction ${mnemonic}`);
    }
};
