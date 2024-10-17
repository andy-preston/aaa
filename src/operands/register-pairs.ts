import type { State } from "../state/mod.ts";
import {
    type Description, type OperandTypes, operandRangeError
} from "./converter.ts";
import { numericValue } from "./numeric.ts";
import type { SymbolicOperand } from "./symbolic.ts";

const pairs = [24, 26, 28, 30];

const allPairs = [
    ...Array(16).keys()
].map(
    (i) => i * 2
);

export const registerPairTypes = (types: OperandTypes, state: State) => {
    const registerPair = (
        symbolic: SymbolicOperand,
        expectation: Description
    ) => {
        const value = numericValue(state, symbolic);
        if (!pairs.includes(value)) {
            operandRangeError("", expectation, symbolic);
        }
        return (value - 24) / 2;
    };

    const anyRegisterPair = (
        symbolic: SymbolicOperand,
        expectation: Description
    ) => {
        const value = numericValue(state, symbolic);
        if (!allPairs.includes(value)) {
            operandRangeError("", expectation, symbolic);
        }
        return value / 2;
    };

    types.set("registerPair", [
        "register pair (R24:R25, R26:R27, R28:29, R30:R31)",
        registerPair
    ]);
    types.set("anyRegisterPair", [
        "any register pair (R0:R1 - R30:R31)",
        anyRegisterPair
    ]);
};
