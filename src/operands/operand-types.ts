import {
    is127, is2KEachWay, is4Meg, is64K, is64EachWay, isPortInDataMemory,
    relative64, relative2K, portInIOSpace,
    isInProgramMemory
} from "./addresses.ts";

import {
    is6Bits, isBitIndex, isByte, isNybble,
    byteValue
} from "./numeric.ts";

import {
    isAnyPair, isImmediate, isMultiply, isPair, isRegister, isZRegister,
    anyPairValue, immediateValue, multiplyValue, pairValue
} from "./registers.ts";

import type { SymbolicOperand } from "./symbolic.ts";

import { type NumericOperand, numeric } from "./numeric.ts";

type Description = string;
type Validator = (operand: SymbolicOperand) => boolean;
type NumericValue = (operand: SymbolicOperand) => NumericOperand;
type SpecialPreCheck = (operand: SymbolicOperand) => string;

export type OperandType = [
    Description,
    Validator,
    NumericValue,
    SpecialPreCheck | undefined
];

const symbolicIsOnlyForCheckCount = (_operand: SymbolicOperand) => {
    throw Error("Internal error: symbolic is only for checkCount");
};

export const operandTypes = {
    "symbolic": [
        "symbolic operand only here for checkCount",
        symbolicIsOnlyForCheckCount, symbolicIsOnlyForCheckCount, undefined
    ],
    "register": [
        "register (R0 - R31)",
        isRegister, numeric, undefined
    ],
    "immediateRegister": [
        "immediate register (R16 - R31)",
        isImmediate, immediateValue, undefined
    ],
    "multiplyRegister": [
        "multiply register (R16 - R23)",
        isMultiply, multiplyValue, undefined
    ],
    "registerPair": [
        "register pair (R24:R25, R26:R27, R28:29, R30:R31)",
        isPair, pairValue, undefined
    ],
    "anyRegisterPair": [
        "any register pair (R0:R1 - R30:R31)",
        isAnyPair, anyPairValue, undefined
    ],
    "z": [
        "Z Register only (R30:R31)",
        isZRegister, numeric, undefined
    ],
    "sixBits": [
        "six bit number (0 - 0x3F)",
        is6Bits, numeric, undefined
    ],
    "bitIndex": [
        "bit index (0 - 7)",
        isBitIndex, numeric, undefined
    ],
    "byte": [
        "byte (-127 - 128) or (0 - 0xFF)",
        isByte, byteValue, undefined
    ],
    "nybble": [
        "nybble (0 - 0x0F)",
        isNybble, numeric, undefined
    ],
    "port": [
        "Data memory mapped into IO space (0x20 - 0x5F)",
        isPortInDataMemory, portInIOSpace, undefined
    ],
    "address": [
        "22 bit address (0 - 0x3FFFFF) (4 Meg)",
        is4Meg, numeric, isInProgramMemory
    ],
    "relativeJump": [
        "relative jump to 12 bit range (-2048 - 2047)",
        is2KEachWay, relative2K, isInProgramMemory
    ],
    "relativeBranch": [
        "relative branch to 7 bit range (-64 - 63)",
        is64EachWay, relative64, isInProgramMemory
    ],
    "16bitRamAddress": [
        "16 bit RAM address (0 - 0xFFFF) (64 K)",
        is64K, numeric, undefined
    ],
    "7bitRamAddress": [
        "7 bit RAM address (0 - 0x7F) (127 Bytes)",
        is127, numeric, undefined
    ]
} as const satisfies Record<string, OperandType>;

export type TypeName = keyof typeof operandTypes;
