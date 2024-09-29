export type SymbolicOperand = string;

export type SymbolicOperands =
    | []
    | [SymbolicOperand]
    | [SymbolicOperand, SymbolicOperand]
    | [SymbolicOperand, SymbolicOperand, SymbolicOperand];
