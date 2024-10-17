import { InternalError } from "../errors/errors.ts";
import type { Description, OperandTypes } from "./converter.ts";

export type SymbolicOperand = string;

export type SymbolicOperands =
    | []
    | [SymbolicOperand]
    | [SymbolicOperand, SymbolicOperand]
    | [SymbolicOperand, SymbolicOperand, SymbolicOperand];

export const convertSymbolic = (operand: SymbolicOperand): SymbolicOperand => (
    operand.indexOf(" ") == -1 ? operand.toUpperCase() : operand
) as SymbolicOperand;

export const symbolicTypes = (types: OperandTypes) => {
    types.set("symbolic", [
        "(symbolic operand)",
        (_operand: SymbolicOperand, _expected: Description) => {
            throw new InternalError("symbolic is only for checkCount");
        }
    ]);
};
