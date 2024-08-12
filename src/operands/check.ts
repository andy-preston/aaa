import {
    NumericOperands,
    OperandIndex,
    SymbolicOperands
} from "./types.ts";

type CheckFunction = (operand: number) => boolean;

const types = {
    "register": [
        (operand: number) => operand >= 0 && operand <= 31,
        "register (R0 - R31)"
    ],
    "immediateRegister": [
        (operand: number) => operand >= 16 && operand <= 31,
        "immediate register (R16 - R31)"
    ],
    "multiplyRegister": [
        (operand: number) => operand >= 16 && operand <= 23,
        "multiply register (R16 - R23)"
    ],
    "registerPair": [
        (operand: number) => [24, 26, 28, 30].includes(operand),
        "register pair (R24:R25, R26:R27, R28:29, R30:R31)"
    ],
    "anyRegisterPair": [
        (operand: number) => operand >= 0 && operand <= 30 && operand % 2 == 0,
        "any register pair (R0:R1 - R30:R31)"
    ],
    "Z": [
        (operand: number) => operand == 30,
        "Z Register only (R30:R31)"
    ],
    "port": [
        (operand: number) => operand >= 0 && operand <= 0x3f,
        "GPIO port (0 - 0x3F)"
    ],
    // These two have the same rule but their context is different
    "sixBits": [
        (operand: number) => operand >= 0 && operand <= 0x3f,
        "six bit number (0 - 0x3F)"
    ],
    "bitIndex": [
        (operand: number) => operand >= 0 && operand <= 7,
        "bit index (0 - 7)"
    ],
    "byte": [
        (operand: number) => operand >= -128 && operand <= 0xff,
        "byte (-128 - 127) or (0 - 0xFF)"
    ],
    "nybble": [
        (operand: number) => operand >= 0 && operand <= 0x0f,
        "nybble (0 - 0x0F)"
    ],
    "address": [
        (operand: number) => operand >= 0 && operand <= 0x3fffff,
        "branch to 22 bit address (0 - 0x3FFFFF) (4 Meg)"
    ],
    "relativeAddress": [
        (operand: number) => operand >= 0 || operand <= 0x1000,
        "branch to 12 bit address (0 - 0x1000) (4 K)"
    ],
    "ramAddress": [
        (operand: number) => operand >= 0 || operand <= 0xffffffff,
        "16 bit RAM address (0 - 0xFFFFFFFF) (64 K)"
    ]
} satisfies Record<string, [CheckFunction, string]>;

export type TypeName = keyof typeof types;

export const check = (
    typeName: TypeName,
    position: OperandIndex,
    value: number
) => {
    const theType = types[typeName];
    if (theType[0](value)) {
        return;
    }
    const positionName = position == 0 ? "first" : "second";
    const displayValue = `${value} / 0x${value.toString(16)}`;
    const expectation = `expecting ${theType[1]} not`;
    throw new RangeError(
        `${positionName} operand out of range - ${expectation} ${displayValue}`
    );
};

const description = (typeName: TypeName): string => types[typeName][1];

export const checkCount = (
    list: SymbolicOperands | NumericOperands,
    expected: Array<TypeName>
) => {
    if (list.length == expected.length) {
        return;
    }
    const descriptions =
        expected.length == 0 ? "none" : expected.map(description).join(" and ");
    throw new Error(
        `Incorrect number of operands - expecting ${descriptions} got ${list}`
    );
};
