import type { OurContext } from "../context/mod.ts";
import { addDirective } from "../context/mod.ts";
import type { BufferPoke } from "../generate/mod.ts";
import { deviceDirective } from "./device-directive.ts";
import { orgDirective } from "./org-directive.ts";
import { pokeDirective } from "./poke-directive.ts";

export type StringDirective = (s: string) => void;

export type NumberDirective = (n: number) => void;

export type ArrayDirective = (a: Array<number> | string) => void;

export type Directive = StringDirective | NumberDirective | ArrayDirective;

export const addDirectives = (
    context: OurContext,
    include: StringDirective,
    poke: BufferPoke
) => {
    addDirective(context.theirs, "include", include);
    addDirective(context.theirs, "device", deviceDirective(context));
    addDirective(context.theirs, "org", orgDirective(context));
    addDirective(context.theirs, "poke", pokeDirective(poke));
};
