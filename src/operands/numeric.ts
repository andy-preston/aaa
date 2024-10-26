import { errorResult, notInteger, type Errors } from "../errors/result.ts";
import type { State } from "../state/mod.ts";
import type { SymbolicOperand } from "./symbolic.ts";

type Modifier = (value: number) => number;

export const numericOperand = (value: number) => {
    const modify = (fn: Modifier) => {
        it.value = fn(it.value);
        return it;
    }
    const it = {
        "which": "value" as const,
        "value": value,
        "modify": modify
    };
    return it;
}

export type NumericOperand = ReturnType<typeof numericOperand>;

export const numericValue = (
    state: State,
    operand: SymbolicOperand
): NumericOperand | Errors => {
    const result = state.context.operand(operand);
    if (result.which == "errors") {
        return result;
    }
    const intResult = Number.parseInt(result.value);
    if (`${intResult}` != result.value && state.pass.showErrors()) {
        return errorResult(notInteger(result.value));
    }
    return numericOperand(intResult);
};
