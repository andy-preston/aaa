import { inContext } from "../context/mod.ts";
import type { SymbolicOperand } from "../operands/mod.ts";
import type { Pass } from "./pass.ts";

export const contextValue = (pass: Pass) =>
    (operand: SymbolicOperand): string => {
    try {
        return inContext(operand).trim();
    }
    catch (error) {
        if (pass.ignoreErrors() && error instanceof ReferenceError) {
            return "0";
        }
        throw error;
    }
};
