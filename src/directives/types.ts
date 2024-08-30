import type { OurContext } from "../context/mod.ts";

export type StringDirective = (s: string) => void;

export type ArrayDirective = (a: Array<number>) => void;

export type DirectiveHandler = StringDirective | ArrayDirective;

export type DirectiveConstructor = (ourContext: OurContext) => DirectiveHandler;
