import { IOPortOutOfRange, OperandOutOfRange } from "../errors/errors.ts";
import type { State } from "../state/mod.ts";
import { type Description, type OperandTypes } from "./converter.ts";
import { numericValue, type NumericOperand } from "./numeric.ts";
import type { SymbolicOperand } from "./symbolic.ts";

export const dataMemoryTypes = (types: OperandTypes, state: State) => {
    const dataMemoryCheck = (address: NumericOperand) => {
        // We're not looking at ramStart here as data memory instructions
        // are allowed to access registers, IO and SRAM, not just SRAM
        const end = state.dataMemory.ramEnd();
        if (address > end) {
            throw new OperandOutOfRange(
                "",
                `within data memory 0 - 0x${end.toString(16)}`,
                `0x${address.toString(16)}`
            );
        }
    };
    const dataMemory = (
        min: number,
        max: number
    ) => (
        symbolic: SymbolicOperand,
        expectation: Description
    ): NumericOperand => {
        const value = numericValue(state, symbolic);
        if (value < min || value > max) {
            throw new OperandOutOfRange("", expectation, symbolic);
        }
        dataMemoryCheck(value);
        return value;
    };

    const ioPort = (
        symbolic: SymbolicOperand,
        expectation: Description
    ): NumericOperand => {
        const value = numericValue(state, symbolic);
        if (value < 0x20 || value > 0x5f) {
            throw new IOPortOutOfRange("", expectation, symbolic, value > 0x5f);
        }
        return value - 0x20;
    };

    // LDS/STS uses RAMPD to access memory above 64K
    // none of "my" parts have > 16K
    types.set("dataAddress16Bit", [
        "16 bit Data Memory address (0 - 0xFFFF) (64 K)",
        dataMemory(0, 0xffff)
    ]);
    types.set("dataAddress7Bit", [
        "7 bit Data Memory address (0 - 0x7F) (127 Bytes)",
        dataMemory(0, 0x7f)
    ]);
    types.set("port", [
        "Data Memory mapped into IO space (0x20 - 0x5F)",
        ioPort
    ]);
};

