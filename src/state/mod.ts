export {
    setRamStart, setRamEnd,
    newDataMemory, allocStack, alloc, ramStart, ramEnd
} from "./data-memory.ts";

export { newPokeBuffer, peek, poke } from "./poke-peek.ts";

export {
    programMemoryEnd, programMemoryBytes,
    programMemoryOrigin, programMemoryAddress, programMemoryStep
} from "./program-memory.ts";

export { passes } from "./pass.ts";

import { contextValue } from "./context-value.ts";
import { resetDataMemory } from "./data-memory.ts";
import { newPass } from "./pass.ts";
import { programMemoryOrigin } from "./program-memory.ts";

export const newState = () => {
    const pass = newPass(
        () => {
            programMemoryOrigin(0);
            resetDataMemory();
        }
    );
    const getContextValue = contextValue(pass);
    return {
        "pass": pass,
        "contextValue": getContextValue
    };
};

export type State = ReturnType<typeof newState>;
