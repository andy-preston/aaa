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

export const portMapper = (dataSpace: NumericOperand) =>
    dataSpace - 0x20;

export const scaledNumericTypes = (
    types: OperandTypes,
    state: State
) => {
    const scaledNumeric = (min: number, max: number, scaler: Scaler) =>
        (symbolic: SymbolicOperand, expectation: Description) => {
            // TODO: we still need to get state (and context) to numericValue
            const value = numericValue(state, symbolic);
            if (value < min || value > max) {
                operandRangeError("", expectation, symbolic);
            }
            return scaler(value);
        };
    // TODO: On reduced core ALL registers are immediateRegister
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
    // TODO RAM addresses need a check like the program memory check
    // LDS/STS uses RAMPD to access memory above 64KB
    // none of "my" parts have > 16K
    // context.ramStart context.ramEnd
    types.set("dataAddress16Bit", [
        "16 bit Data Memory address (0 - 0xFFFF) (64 K)",
        scaledNumeric(0, 0xffff, noScaler)
    ]);
    types.set("dataAddress7Bit", [
        "7 bit Data Memory address (0 - 0x7F) (127 Bytes)",
        scaledNumeric(0, 0x7f, noScaler)
    ]);
    types.set("port", [
        "Data Memory mapped into IO space (0x20 - 0x5F)",
        scaledNumeric(0x20, 0x5f, portMapper)
    ]);
};
