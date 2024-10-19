export { setRamStart, setRamEnd } from "./data-memory.ts";
export { type ProgramMemory, programMemoryBytes } from "./program-memory.ts";
export { passes } from "./pass.ts";

import { contextValue } from "./context-value.ts";
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

    const getContextValue = contextValue(pass);

    return {
        "pass": pass,
        "contextValue": getContextValue,
        "dataMemory": data.public,
        "programMemory": program,
        "poke": poke
    };
};

export type State = ReturnType<typeof newState>;
