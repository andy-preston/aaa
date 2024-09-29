export type { GeneratedCode } from "./generated-code.ts";

export { newPokeBuffer, peek, poke } from "./poke-buffer.ts";

export { template } from "./template.ts";

export { translate } from "./translator.ts";

export { processor } from "./process.ts";

export {
    getProgramMemoryEnd,
    programMemoryAddress,
    programMemoryOrigin,
    programMemoryStep,
    setProgramMemoryEnd
} from "./program-memory.ts";
