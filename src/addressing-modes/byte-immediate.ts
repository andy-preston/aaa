import type { OurContext } from "../context/mod.ts";
import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter, SymbolicOperand} from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

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

export const encode = (
    instruction: Instruction,
    convert: OperandConverter,
    _ourContext: OurContext
): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    const immediate = (operand: SymbolicOperand) => {
        const numeric =
            mnemonic != "SER" ? convert.numeric("byte", operand) : 0;
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

    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    convert.checkCount(
        operands,
        mnemonic != "SER"
            ? ["immediateRegister", "byte"]
            : ["immediateRegister"]
    );
    const prefix = mapping.get(mnemonic)!;
    return template(`${prefix}_KKKK dddd_KKKK`, [
        ["d", convert.numeric("immediateRegister", operands[0]!)],
        ["K", immediate(operands[1]!)]
    ]);
};
