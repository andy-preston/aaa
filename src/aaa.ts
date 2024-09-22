import { createOurContext } from "./context/mod.ts";
import { addDirectives } from "./directives/mod.ts";
import { pokeBuffer } from "./generate/mod.ts";
import { processor } from "./generate/mod.ts";
import { fileLoader } from "./input/mod.ts";
import { operandConverter } from "./operands/mod.ts";
import { outputter } from "./output/mod.ts";
import { languageSplit } from "./source-line/mod.ts";

const topFile = "./file1.txt";

const ourContext = createOurContext();
const pokeBuf = pokeBuffer();
const loader = fileLoader();
const split = languageSplit(ourContext);
const converter = operandConverter(ourContext);
const process = processor(ourContext, converter, pokeBuf.peek);

addDirectives(ourContext, loader.include, pokeBuf.poke);

for (const pass of [1, 2]) {
    if (pass == 2) {
        ourContext.programMemoryPos = 0;
        converter.secondPass();
    }
    loader.include(topFile);
    const output = pass == 1 ? undefined : outputter(topFile);
    for (const [fileName, lineNumber, rawLine] of loader.lines()) {
        const line = split(rawLine);
        if (output != undefined) {
            output.source(fileName, lineNumber, rawLine);
        }
        for (const [address, code, errorMessages] of process(line)) {
            if (output != undefined) {
                output.output(address, code, errorMessages);
            }
        }
    }
    if (output != undefined) {
        output.close();
    }
}
