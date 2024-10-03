export type SymbolicOperand = string;

export type SymbolicOperands =
    | []
    | [SymbolicOperand]
    | [SymbolicOperand, SymbolicOperand]
    | [SymbolicOperand, SymbolicOperand, SymbolicOperand];

export type OperandIndex = 0 | 1 | 2;

export type NumericOperand = number;

export type Description = string;

type NumericValue = (
    operand: SymbolicOperand,
    expected: Description
) => NumericOperand;

export type OperandType = [Description, NumericValue];

export type Scaler = (unscaled: NumericOperand) => NumericOperand;

export const noScaler = (value: NumericOperand) => value;

export const operandRangeError = (
    name: string,
    expectation: string,
    actual: string
) => {
    const problem = `${name} should be ${expectation} not ${actual}`.trim();
    throw new RangeError(`Operand out of range: ${problem}`);
};
