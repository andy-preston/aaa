import { numeric } from "./numeric.ts";
import {
    type NumericOperand, type SymbolicOperand,
    type Description, operandRangeError
} from "./operands.ts";

const pairs = [24, 26, 28, 30];

const allPairs = [
    ...Array(16).keys()
].map(
    (i) => i * 2
);

export const registerPair = (
    symbolic: SymbolicOperand,
    expectation: Description
) => {
    const value = numeric(symbolic);
    if (!pairs.includes(value)) {
        operandRangeError("", expectation, symbolic);
    }
    return (value - 24) / 2;

};

export const anyRegisterPair = (
    symbolic: SymbolicOperand,
    expectation: Description
) => {
    const value = numeric(symbolic);
    if (!allPairs.includes(value)) {
        operandRangeError("", expectation, symbolic);
    }
    return value / 2;
};

export const immediateScaler = (numeric: NumericOperand) => numeric - 16;
