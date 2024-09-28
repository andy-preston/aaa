export type { GeneratedCode } from "./types.ts";

export { type BufferPeek, type BufferPoke, pokeBuffer } from "./poke-buffer.ts";

export { template } from "./template.ts";

export { type Translate, translator } from "./translator.ts";

export { processor } from "./process.ts";

export {
    getProgramMemoryEnd,
    programMemoryAddress,
    programMemoryOrigin,
    programMemoryStep,
    setProgramMemoryEnd
} from "./program-memory.ts";
