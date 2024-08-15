import type { ContextHandler } from "../context/mod.ts";
import { type OperandType, type TypeName, operandTypes } from "./operand-types.ts";
import type { NumericOperand, SymbolicOperand, SymbolicOperands } from "./types.ts";

export const operandConverter = (contextHandler: ContextHandler) => {
    const operands = operandTypes(contextHandler);

    const description = (typeName: TypeName): string => operands[typeName][0];

    const checkCount = (
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

    const check = (
        theType: OperandType,
        raw: SymbolicOperand,
        numeric: NumericOperand
    ) => {
        if (theType[1](numeric)) {
            return;
        }
        const displayValue = `${numeric} / 0x${numeric.toString(16)}`;
        const expectation = `expecting ${theType[0]} not`;
        throw new RangeError(
            `Operand out of range - ${expectation} ${raw} (${displayValue})`
        );
    };

    const standaloneCheck = (
        typeName: TypeName,
        raw: SymbolicOperand,
        numeric: NumericOperand
    ) => check (operands[typeName], raw,numeric);


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
        check(operandType, operand, numericOperand);
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
