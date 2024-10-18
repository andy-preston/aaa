import type { State } from "../state/mod.ts";
import {
    type Description, type OperandTypes, operandRangeError
} from "./converter.ts";
import { type NumericOperand, numericValue } from "./numeric.ts";
import type { SymbolicOperand } from "./symbolic.ts";

type Scaler = (unscaled: NumericOperand) =>
    NumericOperand;

const noScaler = (value: NumericOperand) =>
    value;

const immediateScaler = (numeric: NumericOperand) =>
    numeric - 16;

const signedOrUnsignedByte = (value: NumericOperand) =>
    value < 0 ? 0x0100 + value : value;

export const scaledNumericTypes = (
    types: OperandTypes,
    state: State
) => {
    const scaledNumeric = (min: number, max: number, scaler: Scaler) =>
        (symbolic: SymbolicOperand, expectation: Description) => {
            const value = numericValue(state, symbolic);
            if (value < min || value > max) {
                operandRangeError("", expectation, symbolic);
            }
            return scaler(value);
        };

    types.set("register", [
        "register (R0 - R31)",
        scaledNumeric(0, 31, noScaler)
    ]);
    types.set("immediateRegister", [
        "immediate register (R16 - R31)",
        scaledNumeric(16, 31, immediateScaler)
    ]);
    types.set("multiplyRegister", [
        "multiply register (R16 - R23)",
        scaledNumeric(16, 23, immediateScaler)
    ]);
    types.set("z", [
        "Z Register only (R30:R31)",
        scaledNumeric(30, 30, noScaler)
    ]);
    types.set("sixBits", [
        "six bit number (0 - 0x3F)",
        scaledNumeric(0, 0x3f, noScaler)
    ]);
    types.set("bitIndex", [
        "bit index (0 - 7)",
        scaledNumeric(0, 7, noScaler)
    ]);
    types.set("byte", [
        "byte (-127 - 128) or (0 - 0xFF)",
        scaledNumeric(-128, 0xff, signedOrUnsignedByte)
    ]);
    types.set("nybble", [
        "nybble (0 - 0x0F)",
        scaledNumeric(0, 0x0f, noScaler)
    ]);
};
