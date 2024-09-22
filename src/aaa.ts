import { createOurContext } from "./context/mod.ts";
import { addDirectives } from "./directives/mod.ts";
import { pokeBuffer } from "./generate/mod.ts";
import { processor } from "./generate/mod.ts";
import { fileLoader } from "./input/mod.ts";
import { outputter } from "./output/mod.ts";
import { languageSplit } from "./source-line/mod.ts";

const topFile = "./file1.txt";

const ourContext = createOurContext();
const pokeBuf = pokeBuffer();
const output = outputter(topFile);
const loader = fileLoader(topFile);
const split = languageSplit(ourContext);
const process = processor(ourContext, pokeBuf.peek);

addDirectives(ourContext, loader.include, pokeBuf.poke);

for (const [fileName, lineNumber, rawLine] of loader.lines()) {
    const line = split(rawLine);
    for (const [address, code, errorMessage, poked] of process(line)) {
        if (!poked) {
            output.source(fileName, lineNumber, rawLine);
        }
        output.output(address, code, errorMessage);
    }
}
output.close();
