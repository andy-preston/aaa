import { programMemoryOrigin } from "./program-memory.ts";

export const passes = [1, 2] as const;

type Pass = typeof passes[number];

let currentPass: Pass;

export const startPass = (pass: Pass) => {
    programMemoryOrigin(0);
    currentPass = pass;
}

export const ignoreErrors = () => currentPass == 1;

export const noSideEffects = () => currentPass == 2;
