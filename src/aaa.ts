import {
    addCoupledProperty,
    addDirective,
    deviceDirective,
    newContext,
    newDeviceChecker
} from "./context/mod.ts";
import {
    getProgramMemoryEnd,
    newPokeBuffer,
    poke,
    programMemoryOrigin,
    processor
} from "./generate/mod.ts";
import {
    includeFile,
    languageSplit,
    newSplitter,
    sourceLines,
    topFile
} from "./source-code/mod.ts";
import { closeOutput, newOutput, output, listSource } from "./output/mod.ts";
import { setPass } from "./operands/mod.ts";

const commandLineSourceFile = "./file1.txt";

newContext();
newPokeBuffer();
newSplitter();
newDeviceChecker();
const process = processor();

addDirective("include", includeFile);
addDirective("device", deviceDirective);
addDirective("org", programMemoryOrigin);
addDirective("poke", poke);

addCoupledProperty("progmemEnd", getProgramMemoryEnd);

for (const pass of [1, 2]) {
    if (pass == 2) {
        programMemoryOrigin(0);
        setPass(pass);
        newOutput(commandLineSourceFile);
    }
    topFile(commandLineSourceFile);
    for (const [fileName, lineNumber, rawLine] of sourceLines()) {
        const line = languageSplit(rawLine);
        if (pass == 2) {
            listSource(fileName, lineNumber, rawLine);
        }
        for (const [address, code, errorMessages] of process(line)) {
            if (pass == 2) {
                output(address, code, errorMessages);
            }
        }
    }
    if (pass == 2) {
        closeOutput();
    }
}
