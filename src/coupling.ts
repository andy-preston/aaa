import {
    addCoupledProperty, addDirective,
    newContext, newDeviceChecker,
    deviceDirective
} from "./context/mod.ts";
import {
    getProgramMemoryEnd, programMemoryOrigin,
    newPokeBuffer, poke, processor
} from "./generate/mod.ts";
import {
    newSplitter,
    includeFile
} from "./source-code/mod.ts";

export const coupling = () => {
    newContext();
    newPokeBuffer();
    newSplitter();
    newDeviceChecker();

    addDirective("include", includeFile);
    addDirective("device", deviceDirective);
    addDirective("org", programMemoryOrigin);
    addDirective("poke", poke);

    addCoupledProperty("progmemEnd", getProgramMemoryEnd);

    return processor();
};
