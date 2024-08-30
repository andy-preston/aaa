import type { OurContext } from "../context/mod.ts";
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

export const operandMessage = (expectation: string, actual: string) =>
    `Operand out of range - expecting ${expectation} not ${actual}`;

export const operandConverter = (ourContext: OurContext) => {
    const operands = operandTypes(ourContext);

    const description = (typeName: TypeName): string => operands[typeName][0];

    const checkCount = (list: SymbolicOperands, expected: Array<TypeName>) => {
        if (list.length == expected.length) {
            return;
        }
        const descriptions =
            expected.length == 0
                ? "none"
                : expected.map(description).join(" and ");
        throw new Error(
            `Incorrect number of operands - expecting ${descriptions} got ${list}`
        );
    };

    const check = (theType: OperandType, symbolic: SymbolicOperand) => {
        if (theType[1](symbolic)) {
            return;
        }
        throw new RangeError(operandMessage(theType[0], symbolic));
    };

    const standaloneCheck = (typeName: TypeName, raw: SymbolicOperand) =>
        check(operands[typeName], raw);

    const symbolic = (operand: SymbolicOperand): SymbolicOperand =>
        (operand.indexOf(" ") == -1
            ? operand.toUpperCase()
            : operand) as SymbolicOperand;

    const numeric = (
        typeName: TypeName,
        operand: SymbolicOperand
    ): NumericOperand => {
        const operandType = operands[typeName];
        const numericOperand = operandType[2](operand);
        check(operandType, operand);
        return numericOperand;
    };

    return {
        "numeric": numeric,
        "symbolic": symbolic,
        "check": standaloneCheck,
        "checkCount": checkCount
    };
};

export type OperandConverter = ReturnType<typeof operandConverter>;
