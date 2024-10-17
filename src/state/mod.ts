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

import { inContext } from "../context/context.ts";
import type { SymbolicOperand } from "../operands/mod.ts";
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
        "contextValue": contextValue
    };
};

export type State = ReturnType<typeof newState>;
