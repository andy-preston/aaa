import type { Operands } from "../operands/mod.ts";

export type Instruction = {
    "mnemonic": string;
    "operands": Operands;
};

export const instruction = (mnemonic: string, operands: Operands) => ({
    "mnemonic": mnemonic,
    "operands": operands
});
