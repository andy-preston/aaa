export const indexingOperands
    = ["", "X+", "-X", "Y+", "-Y", "Z+", "-Z"] as const;

export type IndexingOperand = typeof indexingOperands[number];

type Operand = number;

export type Operands = [] | [Operand] | [Operand, Operand];

export type OperandIndex = 0 | 1;
