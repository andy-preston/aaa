import {
    type State, programMemoryAddress, programMemoryEnd
} from "../state/mod.ts";
import {
    type Description, type OperandTypes, operandRangeError
} from "./converter.ts";
import { numericValue, type NumericOperand } from "./numeric.ts";
import type { SymbolicOperand } from "./symbolic.ts";

export const programMemoryTypes = (types: OperandTypes, state: State) => {
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
    const programMemory = (min: number, max: number) =>
        (symbolic: SymbolicOperand, expectation: Description) => {
        const value = numericValue(state, symbolic);
        if (value < min || value > max) {
            operandRangeError("", expectation, symbolic);
        }
        programMemoryCheck(value);
        return value;
    };
    const relativeAddress = (limit: number) =>
        (symbolic: SymbolicOperand, expectation: Description) => {
            const absolute = numericValue(state, symbolic);
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
    types.set("address", [
        "22 bit address (0 - 0x3FFFFF) (4M Words)",
        programMemory(0, 0x3fffff)
    ]);
    types.set("relativeJump", [
        "relative jump to 12 bit range (-2048 - 2047)",
        relativeAddress(2048)
    ]);
    types.set("relativeBranch", [
        "relative branch to 7 bit range (-64 - 63)",
        relativeAddress(64)
    ]);
};
