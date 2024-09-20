import type { OurContext } from "../context/mod.ts";
import { addDirective } from "../context/mod.ts";
import { deviceDirective } from "./device-directive.ts";
import { orgDirective } from "./org-directive.ts";

export type StringDirective = (s: string) => void;

export type NumberDirective = (n: number) => void;

export type ArrayDirective = (a: Array<number>) => void;

export type Directive = StringDirective | NumberDirective | ArrayDirective;

export const addDirectives = (context: OurContext) => {
    addDirective(context.theirs, "device", deviceDirective(context));
    addDirective(context.theirs, "org", orgDirective(context));
};
