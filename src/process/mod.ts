export {
    allocStack, alloc,
    ramStart, ramEnd, setRamStart, setRamEnd
} from './data-memory.ts';

export { passes, startPass } from "./pass.ts";

export { newPokeBuffer, poke } from "./poke-peek.ts";

export { process } from "./process.ts";

export {
    programMemoryEnd,
    programMemoryAddress,
    programMemoryOrigin,
    programMemoryStep,
    programMemoryBytes
} from "./program-memory.ts";
