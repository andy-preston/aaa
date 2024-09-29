import { operandMessage } from "./message.ts";
import type { NumericOperand } from "./numeric.ts";
import {
    type OperandType,
    type TypeName,
    operandTypes
} from "./operand-types.ts";
import type { SymbolicOperand, SymbolicOperands } from "./symbolic.ts";

const description = (typeName: TypeName): string => operandTypes[typeName][0];

const internalCheck = (theType: OperandType, symbolic: SymbolicOperand) => {
    const valid = theType[1];
    if (valid(symbolic)) {
        return;
    }
    throw new RangeError(operandMessage("", theType[0], symbolic));
};

export const checkOperandCount = (
    list: SymbolicOperands,
    expected: Array<TypeName>
) => {
    if (list.length == expected.length) {
        return;
    }
    const descriptions = expected.length == 0
        ? "none"
        : expected.map(description).join(" and ");
    throw new Error(
        `Incorrect number of operands - expecting ${descriptions} got ${list}`
    );
};

export const checkOperand = (typeName: TypeName, raw: SymbolicOperand) =>
    internalCheck(operandTypes[typeName], raw);

export const symbolicOperand = (operand: SymbolicOperand): SymbolicOperand => (
    operand.indexOf(" ") == -1 ? operand.toUpperCase() : operand
) as SymbolicOperand;

export const numericOperand = (
    typeName: TypeName,
    operand: SymbolicOperand
): NumericOperand => {
    const operandType = operandTypes[typeName];
    const convert = operandType[2];
    const numericOperand = convert(operand);
    internalCheck(operandType, operand);
    return numericOperand;
};
