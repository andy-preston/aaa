import { programMemoryEnd, programMemoryAddress } from "../process/mod.ts";
import { type NumericOperand, numeric } from "./numeric.ts";
import type { Description } from "./operand-types.ts";
import { type SymbolicOperand, operandRangeError } from "./operands.ts";

const programMemoryCheck = (address: NumericOperand) => {
    const end = programMemoryEnd();
    if (address > end) {
        operandRangeError(
            "",
            `within program memory 0 - 0x${end.toString(16)}`,
            `0x${address.toString(16)}`
        );
    }
};

export const programMemory = (min: number, max: number) =>
    (symbolic: SymbolicOperand, expectation: Description) => {
        const value = numeric(symbolic);
        if (value < min || value > max) {
            operandRangeError("", expectation, symbolic);
        }
        programMemoryCheck(value);
        return value;
    };

export const relativeAddress = (limit: number) =>
    (symbolic: SymbolicOperand, expectation: Description) => {
        const absolute = numeric(symbolic);
        programMemoryCheck(absolute);
        if (absolute < 0) {
            operandRangeError("", expectation, symbolic);
        }
        const distance = absolute - programMemoryAddress() - 1;
        if (distance < -limit || distance >= limit) {
            operandRangeError("", expectation, symbolic);
        }
        return distance < 0 ? (limit * 2) + distance : distance;
    };
