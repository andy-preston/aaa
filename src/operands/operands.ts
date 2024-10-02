export type SymbolicOperand = string;

export type SymbolicOperands =
    | []
    | [SymbolicOperand]
    | [SymbolicOperand, SymbolicOperand]
    | [SymbolicOperand, SymbolicOperand, SymbolicOperand];

export type OperandIndex = 0 | 1 | 2;

export const operandRangeError = (
    name: string,
    expectation: string,
    actual: string
) => {
    const problem = `${name} should be ${expectation} not ${actual}`.trim();
    throw new RangeError(`Operand out of range: ${problem}`);
};
