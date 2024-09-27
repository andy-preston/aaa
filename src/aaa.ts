import { createOurContext } from "./context/mod.ts";
import { addDirectives } from "./directives/mod.ts";
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

const commandLineSourceFile = "./file1.txt";

const ourContext = createOurContext();
const pokeBuf = pokeBuffer();
newSplitter(ourContext);
const converter = operandConverter(ourContext);
const process = processor(ourContext, converter, pokeBuf.peek);

addDirectives(ourContext, includeFile, pokeBuf.poke);

for (const pass of [1, 2]) {
    if (pass == 2) {
        ourContext.programMemoryPos = 0;
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
