import type { OurContext } from "../context/mod.ts";
import { operandMessage } from "./message.ts";
import type { NumericOperand, SymbolicOperand } from "./types.ts";

export type OperandType = [
    string,
    (operand: SymbolicOperand) => boolean,
    (operand: SymbolicOperand) => NumericOperand
];

export const operandTypes = (ourContext: OurContext) => {
    const numeric = (operand: SymbolicOperand): NumericOperand => {
        const result = ourContext.execute(operand).trim();
        const intResult = Number.parseInt(result);
        if (`${intResult}` != result) {
            throw new TypeError(`Operand type: ${operand} is not an integer`);
        }
        return intResult;
    };

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
        const distance = target - ourContext.programMemoryPos;
        return distance < 0 ? highValue + distance : distance - 1;
    };

    const pairs = [24, 26, 28, 30];

    const allPairs = [...Array(16).keys()].map((i) => i * 2);

    const between = (min: number, operand: SymbolicOperand, max: number) => {
        const value = numeric(operand);
        return value >= min && value <= max;
    };

    const relativeRange = (highValue: number, operand: SymbolicOperand) => {
        const value = relative(highValue, operand);
        return value >= 0 && value <= highValue;
    };

    const symbolicIsOnlyForCheckCount = (_operand: SymbolicOperand) => {
        throw Error("Internal error: symbolic is only for checkCount");
    };

    return {
        "symbolic": [
            "symbolic operand only here for checkCount",
            symbolicIsOnlyForCheckCount,
            symbolicIsOnlyForCheckCount
        ],
        "register": [
            "register (R0 - R31)",
            (operand: SymbolicOperand) => between(0, operand, 31),
            numeric
        ],
        "immediateRegister": [
            "immediate register (R16 - R31)",
            (operand: SymbolicOperand) => between(16, operand, 31),
            (operand: SymbolicOperand) => numeric(operand) - 16
        ],
        "multiplyRegister": [
            "multiply register (R16 - R23)",
            (operand: SymbolicOperand) => between(16, operand, 23),
            (operand: SymbolicOperand) => numeric(operand) - 16
        ],
        "registerPair": [
            "register pair (R24:R25, R26:R27, R28:29, R30:R31)",
            (operand: SymbolicOperand) => pairs.includes(numeric(operand)),
            (operand: SymbolicOperand) => (numeric(operand) - 24) / 2
        ],
        "anyRegisterPair": [
            "any register pair (R0:R1 - R30:R31)",
            (operand: SymbolicOperand) => allPairs.includes(numeric(operand)),
            (operand: SymbolicOperand) => numeric(operand) / 2
        ],
        "z": [
            "Z Register only (R30:R31)",
            (operand: SymbolicOperand) => numeric(operand) == 30,
            numeric
        ],
        "port": [
            "Data memory mapped into IO space (0x20 - 0x5F)",
            (operand: SymbolicOperand) => between(0x20, operand, 0x5f),
            (operand: SymbolicOperand) => (numeric(operand) - 0x20)
        ],
        "sixBits": [
            "six bit number (0 - 0x3F)",
            (operand: SymbolicOperand) => between(0, operand, 0x3f),
            numeric
        ],
        "bitIndex": [
            "bit index (0 - 7)",
            (operand: SymbolicOperand) => between(0, operand, 7),
            numeric
        ],
        "byte": [
            "byte (-127 - 128) or (0 - 0xFF)",
            (operand: SymbolicOperand) => between(-128, operand, 0xff),
            (operand: SymbolicOperand) => {
                const value = numeric(operand);
                return value < 0 ? 0x0100 + value : value;
            }
        ],
        "nybble": [
            "nybble (0 - 0x0F)",
            (operand: SymbolicOperand) => between(0, operand, 0x0f),
            numeric
        ],
        "address": [
            "22 bit address (0 - 0x3FFFFF) (4 Meg)",
            (operand: SymbolicOperand) => between(0, operand, 0x3fffff),
            numeric
        ],
        "relativeJump": [
            "relative jump to 12 bit range (-2048 - 2047)",
            (operand: SymbolicOperand) => relativeRange(0x0fff, operand),
            (operand: SymbolicOperand) => relative(0x0fff, operand)
        ],
        "relativeBranch": [
            "relative branch to 7 bit range (-64 - 63)",
            (operand: SymbolicOperand) => relativeRange(0x7f, operand),
            (operand: SymbolicOperand) => relative(0x7f, operand)
        ],
        "16bitAddress": [
            "16 bit RAM address (0 - 0xFFFF) (64 K)",
            (operand: SymbolicOperand) => between(0, operand, 0xffff),
            numeric
        ],
        "7bitAddress": [
            "7 bit RAM address (0 - 0x7F) (127 Bytes)",
            (operand: SymbolicOperand) => between(0, operand, 0x7f),
            numeric
        ]
    } as const satisfies Record<string, OperandType>;
};

export type TypeName = keyof ReturnType<typeof operandTypes>;
