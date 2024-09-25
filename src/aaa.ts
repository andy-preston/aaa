import { createOurContext } from "./context/mod.ts";
import { addDirectives } from "./directives/mod.ts";
import { pokeBuffer } from "./generate/mod.ts";
import { processor } from "./generate/mod.ts";
import {
    includeFile,
    sourceLines,
    topFile
} from "./source-files/source-files.ts";
import { operandConverter } from "./operands/mod.ts";
import { outputter } from "./output/mod.ts";
import { languageSplit } from "./source-line/mod.ts";

const commandLineSourceFile = "./file1.txt";

const ourContext = createOurContext();
const pokeBuf = pokeBuffer();
const split = languageSplit(ourContext);
const converter = operandConverter(ourContext);
const process = processor(ourContext, converter, pokeBuf.peek);

addDirectives(ourContext, includeFile, pokeBuf.poke);

for (const pass of [1, 2]) {
    if (pass == 2) {
        ourContext.programMemoryPos = 0;
        converter.secondPass();
    }
    topFile(commandLineSourceFile);
    const output = pass == 1 ? undefined : outputter(commandLineSourceFile);
    for (const [fileName, lineNumber, rawLine] of sourceLines()) {
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
