import type { OperandConverter, SymbolicOperand } from "../../operands/mod.ts";
import type { Line, Mnemonic } from "../../source-code/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

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
    const immediate = (mnemonic: Mnemonic, operand: SymbolicOperand) => {
        const numeric = mnemonic != "SER"
            ? operands.numeric("byte", operand)
            : 0;
        switch (mnemonic) {
            // Clear bits in register is an AND with the inverse of the operand
            case "CBR": // Set all bits is basically an LDI with FF
                return 0xff - numeric;
            case "SER":
                return 0xff;
            default: // All the other instructions have "sensible" operands
                return numeric;
        }
    };

    return (line: Line): OptionalCode => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        operands.checkCount(
            line.operands,
            line.mnemonic != "SER"
                ? ["immediateRegister", "byte"]
                : ["immediateRegister"]
        );
        const prefix = mapping.get(line.mnemonic)!;
        return template(`${prefix}_KKKK dddd_KKKK`, [
            ["d", operands.numeric("immediateRegister", line.operands[0]!)],
            ["K", immediate(line.mnemonic, line.operands[1]!)]
        ]);
    };
};
