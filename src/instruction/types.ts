import type { NumericOperands, SymbolicOperands } from "../operands/mod.ts";
import type { Mnemonic } from "../tokens/tokens.ts";
import type { ProgramCounter } from "../context/mod.ts";

export type Instruction = [
    Mnemonic,
    NumericOperands,
    SymbolicOperands,
    ProgramCounter
];
