import type { ContextHandler } from "../context/mod.ts";
import {
    type IndexingOperand,
    type NumericOperands,
    type SymbolicOperands,
    indexingOperands
} from "../operands/mod.ts";
import { Tokens } from "../tokens/tokens.ts";
import type { Instruction } from "./types.ts";


export const tokenConverter = (contextHandler: ContextHandler) => {
    const numericOperands =
        (operands: SymbolicOperands): NumericOperands => operands.map(
            (symbolic) => indexingOperands.includes(symbolic as IndexingOperand)
                ? null
                : contextHandler.evaluate(symbolic)
        ) as NumericOperands;

    const symbolicOperands =
        (operands: SymbolicOperands): SymbolicOperands => operands.map(
            (symbolic) => symbolic.indexOf(" ") == -1
                ? symbolic.toUpperCase()
                : symbolic
        ) as SymbolicOperands;

    return (tokens: Tokens): Instruction => {
        contextHandler.label(tokens[0]!);
        return [
            tokens[1]!.toUpperCase(),
            numericOperands(tokens[2]),
            symbolicOperands(tokens[2]),
            contextHandler.programCounter()
        ];
    };
};
