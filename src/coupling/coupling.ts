import { coupledProperty, directive, newContext } from "../context/mod.ts";
import { newState } from "../state/mod.ts";

import {
    includeFile
} from "../source-code/mod.ts";

export type FileName = string;

export const blankSlate = () => {
    newContext();
}

export const coupling = () => {
    const state = newState();
    directive("include", includeFile);
    directive("device", state.device.directive);
    directive("org", state.programMemory.origin);
    directive("poke", state.poke.poke);
    directive("allocStack", state.dataMemory.allocStack);
    directive("alloc", state.dataMemory.alloc);
    coupledProperty("progmemEnd", state.programMemory.end);
    coupledProperty("ramStart", state.dataMemory.ramStart);
    coupledProperty("ramEnd", state.dataMemory.ramEnd);
    return state;
};
