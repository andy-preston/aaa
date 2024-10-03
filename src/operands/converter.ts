import { type TypeName, operandTypes } from "./operand-types.ts";
import type {
    NumericOperand, SymbolicOperand, SymbolicOperands
} from "./operands.ts";

const description = (typeName: TypeName): string => operandTypes[typeName][0];

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

export const symbolicOperand = (operand: SymbolicOperand): SymbolicOperand => (
    operand.indexOf(" ") == -1 ? operand.toUpperCase() : operand
) as SymbolicOperand;

export const numericOperand = (
    typeName: TypeName,
    symbolic: SymbolicOperand
): NumericOperand => {
    const [expected, convert] = operandTypes[typeName];
    return convert(symbolic, expected);
};
