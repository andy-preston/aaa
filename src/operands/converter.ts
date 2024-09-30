import { operandMessage } from "./message.ts";
import type { NumericOperand } from "./numeric.ts";
import {
    type OperandType,
    type TypeName,
    operandTypes
} from "./operand-types.ts";
import type { SymbolicOperand, SymbolicOperands } from "./symbolic.ts";

const description = (typeName: TypeName): string => operandTypes[typeName][0];

const check = (theType: OperandType, symbolic: SymbolicOperand) => {
    const preCheck = theType[3];
    if (preCheck !== undefined) {
        const error = preCheck(symbolic);
        if (error) {
            throw new RangeError(operandMessage("", error, symbolic));
        }
    }
    const valid = theType[1];
    if (valid(symbolic)) {
        return;
    }
    const description = theType[0];
    throw new RangeError(operandMessage("", description, symbolic));
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

export const checkOperand = (typeName: TypeName, symbolic: SymbolicOperand) =>
    check(operandTypes[typeName], symbolic);

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
    check(operandType, operand);
    return numericOperand;
};
