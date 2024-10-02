import { execute } from "../context/mod.ts";
import { operandRangeError } from "./message.ts";
import { Description } from "./operand-types.ts";
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

type Scaler = (unscaled: NumericOperand) => NumericOperand;

export const noScaler = (value: NumericOperand) => value;

export const signedOrUnsignedByte = (value: NumericOperand) =>
    value < 0 ? 0x0100 + value : value;

export const scaledNumeric = (min: number, max: number, scaler: Scaler) =>
    (symbolic: SymbolicOperand, expectation: Description) => {
        const value = numeric(symbolic);
        if (value < min || value > max) {
            operandRangeError(expectation, symbolic);
        }
        return scaler(value);
    };

