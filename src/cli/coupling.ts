import {
    coupledProperty,
    directive, deviceDirective,
    newContext, newDeviceChecker
} from "../context/mod.ts";

import {
    programMemoryEnd, programMemoryOrigin,
    newPokeBuffer, poke
} from "../process/mod.ts";

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

    coupledProperty("progmemEnd", programMemoryEnd);
};
