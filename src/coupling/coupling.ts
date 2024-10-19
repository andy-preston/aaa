import {
    coupledProperty,
    directive, deviceDirective,
    newContext, newDeviceChecker
} from "../context/mod.ts";
import { newPokeBuffer, poke, newState } from "../state/mod.ts";

import {
    includeFile
} from "../source-code/mod.ts";

export type FileName = string;

export const blankSlate = () => {
    newContext();
    newPokeBuffer();
    newDeviceChecker();
}

export const coupling = () => {
    const state = newState();
    directive("include", includeFile);
    directive("device", deviceDirective);
    directive("org", state.programMemory.origin);
    directive("poke", poke);
    directive("allocStack", state.dataMemory.allocStack);
    directive("alloc", state.dataMemory.alloc);
    coupledProperty("progmemEnd", state.programMemory.end);
    coupledProperty("ramStart", state.dataMemory.ramStart);
    coupledProperty("ramEnd", state.dataMemory.ramEnd);
    return state;
};
