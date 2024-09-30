import { programMemoryAddress } from "../process/mod.ts";
import { operandMessage } from "./message.ts";
import type { SymbolicOperand } from "./symbolic.ts";
import { type NumericOperand, between, numeric } from "./numeric.ts";

const relative = (
    highValue: number,
    operand: SymbolicOperand
): NumericOperand => {
    const target = numeric(operand);
    // TODO: we currently only support 64K of program memory
    if (target < 0 || target > 0xffff) {
        throw new RangeError(
            operandMessage(operand, "a memory address", `${target}`)
        );
    }
    const distance = target - programMemoryAddress();
    return distance < 0 ? highValue + distance : distance - 1;
};

const relativeRange = (highValue: number, operand: SymbolicOperand) => {
    const value = relative(highValue, operand);
    return value >= 0 && value <= highValue;
};

export const is4Meg = (operand: SymbolicOperand) =>
    between(0, operand, 0x3fffff);

export const is64K = (operand: SymbolicOperand) =>
    between(0, operand, 0xffff);

export const is127 = (operand: SymbolicOperand) =>
    between(0, operand, 0x7f);

export const is2KEachWay = (operand: SymbolicOperand) =>
    relativeRange(0x0fff, operand);

export const relative2K = (operand: SymbolicOperand) =>
    relative(0x0fff, operand);

export const is64EachWay = (operand: SymbolicOperand) =>
    relativeRange(0x7f, operand);

export const relative64 = (operand: SymbolicOperand) =>
    relative(0x7f, operand);

export const isPortInDataMemory = (operand: SymbolicOperand) =>
    between(0x20, operand, 0x5f);

export const portInIOSpace = (operand: SymbolicOperand) =>
    (numeric(operand) - 0x20);
