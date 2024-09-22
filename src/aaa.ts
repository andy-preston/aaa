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
const output = outputter(topFile);
const loader = fileLoader();
const split = languageSplit(ourContext);
const converter = operandConverter(ourContext);
const process = processor(ourContext, converter, pokeBuf.peek);

addDirectives(ourContext, loader.include, pokeBuf.poke);
loader.include(topFile);

for (const [fileName, lineNumber, rawLine] of loader.lines()) {
    const line = split(rawLine);
    output.source(fileName, lineNumber, rawLine);
    for (const [address, code, errorMessage] of process(line)) {
        output.output(address, code, errorMessage);
    }
}
output.close();
