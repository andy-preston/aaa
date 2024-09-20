import { addDirective, createOurContext } from "./context/mod.ts";
import { addDirectives } from "./directives/mod.ts";
import { type GeneratedCode, generator } from "./generate/mod.ts";
import { outputter } from "./output/mod.ts";
import { fileLoader } from "./input/file-loader.ts";
import { sourceLine } from "./source-line/mod.ts";

const topFile = "./file1.txt";

const ourContext = createOurContext();
const output = outputter(topFile);
const tokensFromLine = sourceLine(ourContext);
const generate = generator(ourContext);
const loader = fileLoader(topFile);

addDirective(ourContext.theirs, "include", loader.include);
addDirectives(ourContext);

let errorMessage: string;
let code: GeneratedCode;
for (const [fileName, lineNumber, rawLine] of loader.lines()) {
    try {
        errorMessage = "";
        code = generate(tokensFromLine(rawLine));
    } catch (error) {
        errorMessage = `${error.name}: ${error.message}`;
        code = [];
    }
    output.source(fileName, lineNumber, rawLine);
    output.output(ourContext.programMemoryPos, code, errorMessage);
}
output.close();
