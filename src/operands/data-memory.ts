import { NumericOperand } from "./operands.ts";

export const portMapper = (dataSpace: NumericOperand) => dataSpace - 0x20;
