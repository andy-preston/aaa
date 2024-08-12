export const indexingOperands = ["X+", "-X", "Y+", "-Y", "Z+", "-Z"] as const;

export type IndexingOperand = (typeof indexingOperands)[number];

type NumericOperand = number | null;

export type NumericOperands = |
    [] |
    [NumericOperand] |
    [NumericOperand, NumericOperand] |
    [NumericOperand, NumericOperand, NumericOperand];

export type SymbolicOperands = |
    [] |
    [string] |
    [string, string] |
    [string, string, string];

export type OperandIndex = 0 | 1;
