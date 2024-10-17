import type { State } from "../state/mod.ts";
import type { NumericOperand } from "./numeric.ts";
import { programMemoryTypes } from "./program-memory.ts";
import { registerPairTypes } from "./register-pairs.ts";
import { scaledNumericTypes } from "./scaled-numeric.ts";
import {
    type SymbolicOperand, type SymbolicOperands,
    convertSymbolic, symbolicTypes
} from "./symbolic.ts";

////////////////////////////////////////////////////////////////////////////////
//
// TODO: If we had special exceptions instead of the built-in ones we could
// do things like is a port is outside of IO range in an IO space instruction
// we could hint that they should be using a data-space instruction instead
//
////////////////////////////////////////////////////////////////////////////////
//
// TODO: Like program memory instructions check if an operand is in PM bounds
// RAM/Data-memory operands should do the same.
//
////////////////////////////////////////////////////////////////////////////////

export type OperandIndex = 0 | 1 | 2;

export type Description = string;

type NumericValue = (
    operand: SymbolicOperand,
    expected: Description
) => NumericOperand;

export type OperandType = [Description, NumericValue];

export type OperandTypes = Map<string, OperandType>;

const types: OperandTypes = new Map();

export const operandRangeError = (
    name: string,
    expectation: string,
    actual: string
) => {
    const problem = `${name} should be ${expectation} not ${actual}`.trim();
    throw new RangeError(`Operand out of range: ${problem}`);
};

const description = (typeName: string): string =>
    types.has(typeName) ? types.get(typeName)![0] : "UNKNOWN";

export const checkCount = (
    list: SymbolicOperands,
    expected: Array<string>
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

const convertNumeric = (
    typeName: string,
    symbolic: SymbolicOperand
): NumericOperand => {
    const [expected, convert] = types.get(typeName)!;
    return convert(symbolic, expected);
};

export const operandConverter = (state: State) => {
    symbolicTypes(types);
    // TODO: we still need to get state down to numeric.ts
    scaledNumericTypes(types, state);
    registerPairTypes(types, state);
    programMemoryTypes(types, state);

    return {
        "checkCount": checkCount,
        "symbolic": convertSymbolic,
        "numeric": convertNumeric
    };
};

export type OperandConverter = ReturnType<typeof operandConverter>;
