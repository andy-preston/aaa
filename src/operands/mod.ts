export type { SymbolicOperand, SymbolicOperands } from "./symbolic.ts";

export type { TypeName } from "./operand-types.ts";

export {
    checkOperand, checkOperandCount,
    numericOperand, symbolicOperand
} from "./converter.ts";

export { operandMessage } from "./message.ts";

export { type NumericOperand, setPass } from "./numeric.ts";

export type OperandIndex = 0 | 1 | 2;
