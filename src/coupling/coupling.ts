import {
    coupledProperty,
    directive, deviceDirective,
    newContext, newDeviceChecker
} from "../context/mod.ts";
import {
    programMemoryEnd, programMemoryOrigin,
    newDataMemory, ramStart, ramEnd, allocStack, alloc,
    newPokeBuffer, poke,
} from "../state/mod.ts";

import {
    includeFile
} from "../source-code/mod.ts";

export type FileName = string;

export const blankSlate = () => {
    newContext();
    newPokeBuffer();
    newDeviceChecker();
    newDataMemory();
}

export const coupling = () => {
    directive("include", includeFile);
    directive("device", deviceDirective);
    directive("org", programMemoryOrigin);
    directive("poke", poke);
    directive("allocStack", allocStack);
    directive("alloc", alloc);
    coupledProperty("progmemEnd", programMemoryEnd);
    coupledProperty("ramStart", ramStart);
    coupledProperty("ramEnd", ramEnd);
};
