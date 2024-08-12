import type { NumericOperands, SymbolicOperands } from "../operands/mod.ts";
import type { Mnemonic } from "../tokens/tokens.ts";

type ProgramCounter = number;

export type Instruction = [
    Mnemonic,
    NumericOperands,
    SymbolicOperands,
    ProgramCounter
];
