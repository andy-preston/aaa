import { portMapper } from "./data-memory.ts";

import { signedOrUnsignedByte, scaledNumeric } from "./numeric.ts";

import { programMemory, relativeAddress } from "./program-memory.ts";

import { anyRegisterPair, immediateScaler, registerPair } from "./registers.ts";

import { noScaler, type Description, type OperandType, type SymbolicOperand } from "./operands.ts";

const symbolicIsOnlyForCheckCount = (
    _operand: SymbolicOperand,
    _expected: Description
) => {
    throw Error("Internal error: symbolic is only for checkCount");
};

export const operandTypes = {
    "symbolic": [
        "(symbolic operand)",
        symbolicIsOnlyForCheckCount
    ],
    "register": [
        "register (R0 - R31)",
        scaledNumeric(0, 31, noScaler)
    ],
    "immediateRegister": [
        "immediate register (R16 - R31)",
        scaledNumeric(16, 31, immediateScaler)
    ],
    "multiplyRegister": [
        "multiply register (R16 - R23)",
        scaledNumeric(16, 23, immediateScaler)
    ],
    "registerPair": [
        "register pair (R24:R25, R26:R27, R28:29, R30:R31)",
        registerPair
    ],
    "anyRegisterPair": [
        "any register pair (R0:R1 - R30:R31)",
        anyRegisterPair
    ],
    "z": [
        "Z Register only (R30:R31)",
        scaledNumeric(30, 30, noScaler)
    ],
    "sixBits": [
        "six bit number (0 - 0x3F)",
        scaledNumeric(0, 0x3f, noScaler)
    ],
    "bitIndex": [
        "bit index (0 - 7)",
        scaledNumeric(0, 7, noScaler)
    ],
    "byte": [
        "byte (-127 - 128) or (0 - 0xFF)",
        scaledNumeric(-128, 0xff, signedOrUnsignedByte)
    ],
    "nybble": [
        "nybble (0 - 0x0F)",
        scaledNumeric(0, 0x0f, noScaler)
    ],
    "address": [
        "22 bit address (0 - 0x3FFFFF) (4M Words)",
        programMemory(0, 0x3fffff)
    ],
    "relativeJump": [
        "relative jump to 12 bit range (-2048 - 2047)",
        relativeAddress(2048)
    ],
    "relativeBranch": [
        "relative branch to 7 bit range (-64 - 63)",
        relativeAddress(64)
    ],
    "dataAddress16Bit": [
        "16 bit Data Memory address (0 - 0xFFFF) (64 K)",
        scaledNumeric(0, 0xffff, noScaler)
    ],
    "dataAddress7Bit": [
        "7 bit Data Memory address (0 - 0x7F) (127 Bytes)",
        scaledNumeric(0, 0x7f, noScaler)
    ],
    "port": [
        "Data Memory mapped into IO space (0x20 - 0x5F)",
        scaledNumeric(0x20, 0x5f, portMapper)
    ]
} as const satisfies Record<string, OperandType>;

export type TypeName = keyof typeof operandTypes;
