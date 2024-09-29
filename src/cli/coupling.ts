import {
    newContext, newDeviceChecker,
    coupledProperty, directive,
    deviceDirective
} from "../context/mod.ts";

import {
    getProgramMemoryEnd, programMemoryOrigin,
    newPokeBuffer, poke
} from "../generate/mod.ts";

import {
    newSplitter,
    includeFile
} from "../source-code/mod.ts";

export const coupling = () => {
    newContext();
    newPokeBuffer();
    newSplitter();
    newDeviceChecker();

    directive("include", includeFile);
    directive("device", deviceDirective);
    directive("org", programMemoryOrigin);
    directive("poke", poke);

    coupledProperty("progmemEnd", getProgramMemoryEnd);
};
