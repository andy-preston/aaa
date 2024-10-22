import { IncorrectNumberOfOperands } from "../errors/errors.ts";
import type { State } from "../state/mod.ts";
import { dataMemoryTypes } from "./data-memory.ts";
import type { NumericOperand } from "./numeric.ts";
import { programMemoryTypes } from "./program-memory.ts";
import { registerPairTypes } from "./register-pairs.ts";
import { scaledNumericTypes } from "./scaled-numeric.ts";
import {
    type SymbolicOperand, type SymbolicOperands,
    convertSymbolic, symbolicTypes
} from "./symbolic.ts";

export type OperandIndex = 0 | 1 | 2;

export type Description = string;

type NumericValue = (
    operand: SymbolicOperand,
    expected: Description
) => NumericOperand;

export type OperandType = [Description, NumericValue];

export type OperandTypes = Map<string, OperandType>;

const types: OperandTypes = new Map();

const description = (typeName: string): string =>
    types.has(typeName) ? types.get(typeName)![0] : "UNKNOWN";

export const checkCount = (
    list: SymbolicOperands,
    expected: Array<string>
) => {
    if (list.length != expected.length) {
        throw new IncorrectNumberOfOperands(expected.map(description), list);
    };
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
    scaledNumericTypes(types, state);
    registerPairTypes(types, state);
    programMemoryTypes(types, state);
    dataMemoryTypes(types, state);

    return {
        "checkCount": checkCount,
        "symbolic": convertSymbolic,
        "numeric": convertNumeric
    };
};

export type OperandConverter = ReturnType<typeof operandConverter>;
