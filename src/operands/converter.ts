import { execute } from "../context/mod.ts";
import { operandMessage } from "./message.ts";
import {
    type OperandType,
    type TypeName,
    operandTypes
} from "./operand-types.ts";
import type {
    NumericOperand,
    SymbolicOperand,
    SymbolicOperands
} from "./types.ts";

let ignoreErrors: boolean;

export const setPass = (pass: 1 | 2) => {
    ignoreErrors = pass == 1;
}

const operandValue = (operand: SymbolicOperand): string => {
    try {
        return execute(operand).trim();
    }
    catch (error) {
        if (error.name == "ReferenceError" && ignoreErrors) {
            return "0";
        }
        throw error;
    }
};

const types = operandTypes(operandValue);

const description = (typeName: TypeName): string => types[typeName][0];

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
    internalCheck(types[typeName], raw);

export const symbolicOperand = (operand: SymbolicOperand): SymbolicOperand => (
    operand.indexOf(" ") == -1 ? operand.toUpperCase() : operand
) as SymbolicOperand;

export const numericOperand = (
    typeName: TypeName,
    operand: SymbolicOperand
): NumericOperand => {
    const operandType = types[typeName];
    const numericOperand = operandType[2](operand);
    internalCheck(operandType, operand);
    return numericOperand;
};
