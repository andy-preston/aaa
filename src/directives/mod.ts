import { addDirective } from "../context/mod.ts";
import { programMemoryOrigin } from "../context/program-memory.ts";
import type { BufferPoke } from "../generate/mod.ts";
import { pokeDirective } from "./poke-directive.ts";

export type StringDirective = (s: string) => void;

export type NumberDirective = (n: number) => void;

export type ArrayDirective = (a: Array<number> | string) => void;

export type Directive = StringDirective | NumberDirective | ArrayDirective;

export const addDirectives = (
    include: StringDirective,
    device: StringDirective,
    poke: BufferPoke
) => {
    addDirective("include", include);
    addDirective("device", device);
    addDirective("org", programMemoryOrigin);
    addDirective("poke", pokeDirective(poke));
};
