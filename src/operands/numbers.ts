import { between, numeric } from "./numeric.ts";
import { SymbolicOperand } from "./symbolic.ts";

export const is6Bits = (operand: SymbolicOperand) =>
    between(0, operand, 0x3f);

export const isBitIndex = (operand: SymbolicOperand) =>
    between(0, operand, 7);

export const isByte = (operand: SymbolicOperand) =>
    between(-128, operand, 0xff);

export const byteValue = (operand: SymbolicOperand) => {
    const value = numeric(operand);
    return value < 0 ? 0x0100 + value : value;
};

export const isNybble = (operand: SymbolicOperand) =>
    between(0, operand, 0x0f);
