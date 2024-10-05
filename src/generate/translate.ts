import { addressingModes } from "../addressing-modes/mod.ts";
import { deviceName } from "../context/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

export type GeneratedCode =
    | []
    | [number, number]
    | [number, number, number, number];

let unsupportedInstructions: Array<string> = [];

export const setUnsupportedInstructions = (instructions: Array<string>) => {
    unsupportedInstructions = instructions;
};

export const translate = (instruction: Instruction): GeneratedCode => {
    const mnemonic = instruction[0];
    if (mnemonic == "") {
        return [];
    }
    const device = deviceName("determine which instructions are available");
    if (unsupportedInstructions.includes(mnemonic)) {
        throw new Error(`${mnemonic} is not available on ${device}`);
    }
    for (const addressingMode of addressingModes) {
        const generatedCode = addressingMode(instruction);
        if (generatedCode != null) {
            return generatedCode;
        }
    }
    throw new SyntaxError(`unknown instruction ${mnemonic}`);
};
