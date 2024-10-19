import type { State } from "../state/mod.ts";
import type { SymbolicOperand } from "./symbolic.ts";

export type NumericOperand = number;

export const numericValue = (
    state: State,
    operand: SymbolicOperand
): NumericOperand => {
    const result = state.context.operand(operand);
    const intResult = Number.parseInt(result);
    if (`${intResult}` != result && state.pass.showErrors()) {
        throw new TypeError(`Operand type: ${operand} is not an integer`);
    }
    return intResult;
};
