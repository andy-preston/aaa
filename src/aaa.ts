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
    if (code.length > 0 && errorMessage == "" && ourContext.device == "") {
        errorMessage =
            "Device not selected, some instructions may not be available";
    }
    output.output(
        fileName,
        lineNumber,
        ourContext.programMemoryPos,
        code,
        rawLine,
        errorMessage
    );
}
output.close();
