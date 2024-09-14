import { createOurContext } from "../context/mod.ts";
import { directives } from "../directives/list.ts";
import { GeneratedCode, generator } from "../generate/mod.ts";
import { outputter } from "../output/mod.ts";
import { fileLoader } from "./file-loader.ts";
import { sourceLine } from "../source-line/mod.ts";

const topFile = "./file1.txt";

const ourContext = createOurContext();
const output = outputter(topFile);
const tokensFromLine = sourceLine(ourContext);
const generate = generator(ourContext);
const loader = fileLoader(topFile);

ourContext.addDirective(["include", loader.include]);
for (const directive of directives) {
    ourContext.addDirective(directive);
}

let errorMessage: string;
let code: GeneratedCode;
for (const [fileName, lineNumber, rawLine] of loader.lines()) {
    const flashAddress = ourContext.flashPos();
    try {
        errorMessage = "";
        code = generate(tokensFromLine(rawLine));
    } catch (error) {
        errorMessage = `${error.name}: ${error.message}`;
        code = [];
    }
    output.output(
        fileName,
        lineNumber,
        flashAddress,
        code,
        rawLine,
        errorMessage
    );
}
output.close();
