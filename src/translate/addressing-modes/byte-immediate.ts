import { type Errors } from "../../errors/result.ts";
import type { OperandConverter } from "../../operands/mod.ts";
import { numericOperand } from "../../operands/numeric.ts";
import type { Line } from "../../source-code/mod.ts";
import { template } from "../template.ts";
import type { GeneratedCode } from "../translate.ts";

const mapping: Map<string, string> = new Map([
    ["CPI", "0011"],
    ["SBCI", "0100"],
    ["SUBI", "0101"],
    ["ORI", "0110"], // SBR and
    ["SBR", "0110"], // ORI are the same instruction
    ["ANDI", "0111"], // CBR and
    ["CBR", "0111"], //  ANDI are ALMOST the same instruction
    ["LDI", "1110"], // SER and
    ["SER", "1110"] //  LDI are ALMOST the same instruction
]);

export const encode = (operands: OperandConverter) => {
    return (line: Line): GeneratedCode | Errors | undefined => {

        const operandModifier = (operandValue: number): number => {
            switch (line.mnemonic) {
                case "CBR":
                    // Clear bits is an AND with the inverse of the operand
                    return 0xff - operandValue;
                case "SER":
                    // Set all bits is basically an LDI with FF
                    return 0xff;
                default:
                    // All the other instructions have "sensible" operands
                    return operandValue;
            }
        };

        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }

        operands.checkCount(
            line.operands,
            line.mnemonic != "SER"
                ? ["immediateRegister", "byte"]
                : ["immediateRegister"]
        );

        const actualOperand = line.mnemonic != "SER"
            ? operands.numeric("byte", line.operands[1]!)
            : numericOperand(0);
        if (actualOperand.which == "errors") {
            return actualOperand;
        }


        const register = operands.numeric("immediateRegister", line.operands[0]!);
        if (register.which == "errors") {
            return register;
        }

        const prefix = mapping.get(line.mnemonic)!;

        return template(`${prefix}_KKKK dddd_KKKK`, [
            ["d", register.value],
            ["K", actualOperand.modify(operandModifier).value]
        ]);
    };
};
