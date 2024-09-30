import { execute } from "../context/mod.ts";
import type { SymbolicOperand } from "./symbolic.ts";

export type NumericOperand = number;

let ignoreErrors: boolean;

export const setPass = (pass: 1 | 2) => {
    ignoreErrors = pass == 1;
}

const operandValue = (operand: SymbolicOperand): string => {
    try {
        return execute(operand).trim();
    }
    catch (error) {
        if (error.name == "ReferenceError" && ignoreErrors) {
            return "0";
        }
        throw error;
    }
};

export const numeric = (operand: SymbolicOperand): NumericOperand => {
    const result = operandValue(operand);
    const intResult = Number.parseInt(result);
    if (`${intResult}` != result) {
        throw new TypeError(`Operand type: ${operand} is not an integer`);
    }
    return intResult;
};

export const between = (min: number, operand: SymbolicOperand, max: number) => {
    const value = numeric(operand);
    return value >= min && value <= max;
};

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
