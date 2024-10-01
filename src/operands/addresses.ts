import { programMemoryEnd, programMemoryAddress } from "../process/mod.ts";
import { type NumericOperand, between, numeric } from "./numeric.ts";
import type { SymbolicOperand } from "./symbolic.ts";

const relativeDistance = (operand: SymbolicOperand): number =>
    numeric(operand) - programMemoryAddress() - 1;

const relative = (limit: number, operand: SymbolicOperand): NumericOperand => {
    if (!relativeRange(limit, operand)) {
        return 0;
    }
    const distance = relativeDistance(operand);
    return distance < 0 ? (limit * 2) + distance : distance;
};

const relativeRange = (limit: number, operand: SymbolicOperand) => {
    const distance = relativeDistance(operand);
    return distance >= -limit && distance < limit;
};

export const isInProgramMemory = (operand: SymbolicOperand): string => {
    const end = programMemoryEnd();
    return between(0, operand, end)
        ? "" : `within program memory 0 - 0x${end.toString(16)}`;
};

export const is4Meg = (operand: SymbolicOperand) =>
    between(0, operand, 0x3fffff);

export const is64K = (operand: SymbolicOperand) =>
    between(0, operand, 0xffff);

export const is127 = (operand: SymbolicOperand) =>
    between(0, operand, 0x7f);

export const isRelative12Bit = (operand: SymbolicOperand) =>
    relativeRange(2048, operand);

export const relative12Bit = (operand: SymbolicOperand) =>
    relative(2048, operand);

export const isRelative7Bit = (operand: SymbolicOperand) =>
    relativeRange(64, operand);

export const relative7Bit = (operand: SymbolicOperand) =>
    relative(64, operand);

export const isPortInDataMemory = (operand: SymbolicOperand) =>
    between(0x20, operand, 0x5f);

export const portInIOSpace = (operand: SymbolicOperand) =>
    (numeric(operand) - 0x20);
