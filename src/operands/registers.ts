import { SymbolicOperand } from "./symbolic.ts";
import { between, numeric } from "./numeric.ts";

const pairs = [24, 26, 28, 30];

const allPairs = [
    ...Array(16).keys()
].map(
    (i) => i * 2
);

export const isPair = (operand: SymbolicOperand) =>
    pairs.includes(numeric(operand));

export const pairValue = (operand: SymbolicOperand) =>
    (numeric(operand) - 24) / 2;

export const isAnyPair = (operand: SymbolicOperand) =>
    allPairs.includes(numeric(operand));

export const anyPairValue = (operand: SymbolicOperand) =>
    numeric(operand) / 2;

export const isZRegister = (operand: SymbolicOperand) =>
    numeric(operand) == 30;

export const isMultiply = (operand: SymbolicOperand) =>
    between(16, operand, 23);

export const multiplyValue = (operand: SymbolicOperand) =>
    numeric(operand) - 16;

export const isImmediate = (operand: SymbolicOperand) =>
    between(16, operand, 31);

export const immediateValue = (operand: SymbolicOperand) =>
    numeric(operand) - 16;

// TODO: On reduced core ALL registers are immediateRegister

export const isRegister = (operand: SymbolicOperand) =>
    between(0, operand, 31);
