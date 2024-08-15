import { ContextHandler } from "../context/mod.ts";
import { twosComplement } from "./twos-complement.ts";
import { NumericOperand, SymbolicOperand } from "./types.ts";

export type OperandType = [
    string,
    (operand :NumericOperand) => boolean,
    (operand :SymbolicOperand) => NumericOperand
];

export const operandTypes = (context: ContextHandler) => {

    const numeric = (operand: SymbolicOperand): NumericOperand => {
        return context.evaluate(operand) as NumericOperand;
    };

    const relativeJump = (
        operand: SymbolicOperand,
        bits: number
    ): NumericOperand => {
        const target = numeric(operand) - 1 - context.programCounter();
        try {
            return twosComplement(target, bits, true);
        } catch (error) {
            throw new RangeError(`Relative jump ${error.message}`);
        }
    };

    return {
        "register": [
            "register (R0 - R31)",
            (operand: NumericOperand) => operand >= 0 && operand <= 31,
            numeric
        ],
        "immediateRegister": [
            "immediate register (R16 - R31)",
            (operand: NumericOperand) => operand >= 16 && operand <= 31,
            (operand: SymbolicOperand) => numeric(operand) - 16
        ],
        "multiplyRegister": [
            "multiply register (R16 - R23)",
            (operand: NumericOperand) => operand >= 16 && operand <= 23,
            (operand: SymbolicOperand) => numeric(operand) - 16
        ],
        "registerPair": [
            "register pair (R24:R25, R26:R27, R28:29, R30:R31)",
            (operand: NumericOperand) => [24, 26, 28, 30].includes(operand),
            (operand: SymbolicOperand) => (numeric(operand) - 24) / 2
        ],
        "anyRegisterPair": [
            "any register pair (R0:R1 - R30:R31)",
            (operand: NumericOperand) => operand >= 0 && operand <= 30 && operand % 2 == 0,
            (operand: SymbolicOperand) => (numeric(operand)) / 2
        ],
        "Z": [
            "Z Register only (R30:R31)",
            (operand: NumericOperand) => operand == 30,
            numeric
        ],
        // These two have the same rule but their context is different
        "port": [
            "GPIO port (0 - 0x3F)",
            (operand: NumericOperand) => operand >= 0 && operand <= 0x3f,
            numeric
        ],
        "sixBits": [
            "six bit number (0 - 0x3F)",
            (operand: NumericOperand) => operand >= 0 && operand <= 0x3f,
            numeric
        ],
        "bitIndex": [
            "bit index (0 - 7)",
            (operand: NumericOperand) => operand >= 0 && operand <= 7,
            numeric
        ],
        "byte": [
            "byte (-128 - 127) or (0 - 0xFF)",
            (operand: NumericOperand) => operand >= -128 && operand <= 0xff,
            numeric
        ],
        "nybble": [
            "nybble (0 - 0x0F)",
            (operand: NumericOperand) => operand >= 0 && operand <= 0x0f,
            numeric
        ],
        "address": [
            "branch to 22 bit address (0 - 0x3FFFFF) (4 Meg)",
            (operand: NumericOperand) => operand >= 0 && operand <= 0x3fffff,
            numeric
        ],
        "relative12bits": [
            "branch to 12 bit address (0 - 0x1000) (4 K)",
            (operand: NumericOperand) => operand >= 0 || operand <= 0x1000,
            (operand: SymbolicOperand) => relativeJump(operand, 12)
        ],
        "relative7bit": [
            "branch to 12 bit address (0 - 0x7F) (127 bytes)",
            (operand: NumericOperand) => operand >= 0 || operand <= 0x7f,
            (operand: SymbolicOperand) => relativeJump(operand, 7)
        ],
        "16bitAddress": [
            "16 bit RAM address (0 - 0xFFFFFFFF) (64 K)",
            (operand: NumericOperand) => operand >= 0 || operand <= 0xffffffff,
            numeric
        ],
        "7bitAddress": [
            "7 bit RAM address (0 - 0x7F) (127 Bytes)",
            (operand: NumericOperand) => operand >= 0 || operand <= 0x7f,
            numeric
        ]
    } as const satisfies Record<string, OperandType>;
};

export type TypeName = keyof ReturnType<typeof operandTypes>;
