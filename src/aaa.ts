import { addDirective, deviceDirective } from "./context/mod.ts";
import { pokeBuffer } from "./generate/mod.ts";
import { processor } from "./generate/mod.ts";
import {
    includeFile,
    languageSplit,
    newSplitter,
    sourceLines,
    topFile
} from "./source-code/mod.ts";
import { operandConverter } from "./operands/mod.ts";
import { closeOutput, newOutput, output, listSource } from "./output/mod.ts";
import { addCoupledProperty, newContext } from "./context/context.ts";
import { getProgramMemoryEnd, programMemoryOrigin } from "./context/program-memory.ts";
import { pokeDirective } from "./directives/poke-directive.ts";

const commandLineSourceFile = "./file1.txt";

newContext();
const pokeBuf = pokeBuffer();
newSplitter();
const converter = operandConverter();
const process = processor(converter, pokeBuf.peek);

addDirective("include", includeFile);
addDirective("device", deviceDirective);
addDirective("org", programMemoryOrigin);
addDirective("poke", pokeDirective(pokeBuf.poke));

addCoupledProperty("progmemEnd", getProgramMemoryEnd);

for (const pass of [1, 2]) {
    if (pass == 2) {
        programMemoryOrigin(0);
        converter.secondPass();
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
