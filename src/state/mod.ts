export {
    setRamStart, setRamEnd,
    newDataMemory, allocStack, alloc, ramStart, ramEnd
} from "./data-memory.ts";

export { passes, startPass, ignoreErrors } from "./pass.ts";

export { newPokeBuffer, peek, poke } from "./poke-peek.ts";

export {
    programMemoryEnd, programMemoryBytes,
    programMemoryOrigin, programMemoryAddress, programMemoryStep
} from "./program-memory.ts";