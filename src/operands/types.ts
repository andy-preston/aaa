export const indexingOperands = ["X+", "-X", "Y+", "-Y", "Z+", "-Z"] as const;

export type IndexingOperand = (typeof indexingOperands)[number];

export type NumericOperand = number;

export type SymbolicOperand = string;

export type SymbolicOperands =
    | []
    | [SymbolicOperand]
    | [SymbolicOperand, SymbolicOperand]
    | [SymbolicOperand, SymbolicOperand, SymbolicOperand];

export type OperandIndex = 0 | 1;
