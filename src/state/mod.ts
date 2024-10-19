export { setRamStart, setRamEnd } from "./data-memory.ts";
export { type ProgramMemory, programMemoryBytes } from "./program-memory.ts";
export { passes } from "./pass.ts";

import { inContext } from "../context/context.ts";
import type { SymbolicOperand } from "../operands/mod.ts";
import { dataMemory } from "./data-memory.ts";
import { newPass } from "./pass.ts";
import { pokeBuffer } from "./poke-peek.ts";
import { programMemory } from "./program-memory.ts";

export const newState = () => {
    const data = dataMemory();
    const program = programMemory();
    const poke = pokeBuffer();
    const pass = newPass(() => {
        program.origin(0);
        data.reset();
    });

    const contextValue = (operand: SymbolicOperand): string => {
        try {
            return inContext(operand).trim();
        }
        catch (error) {
            if (pass.ignoreErrors() && error instanceof ReferenceError) {
                return "0";
            }
            throw error;
        }
    };

    return {
        "pass": pass,
        "contextValue": contextValue,
        "dataMemory": data.public,
        "programMemory": program,
        "poke": poke
    };
};

export type State = ReturnType<typeof newState>;
