import { newContext } from "../context/mod.ts";
import { newGenerator } from "../generate/mod.ts";
import { lineTokens } from "../load-tokenise/mod.ts";
import { newLineLoader } from "./line-loader.ts";

const includedFile = (line: string) =>
    line.replace(".include", "").trim();

const context = newContext();
const loadLine = newLineLoader(context);
const generate = newGenerator(context);

export const load = (fileName: string) => {
    const lines = Deno.readTextFileSync(fileName).split("\n").entries();
    for (const [lineNumber, rawLine] of lines) {
        if (rawLine.includes(".include")) {
            load(includedFile(rawLine));
            continue;
        }
        try {
            console.log(fileName, lineNumber + 1, rawLine);
            const line = loadLine(rawLine);
            console.log(fileName, lineNumber + 1, line);
            const tokens = lineTokens(line);
            console.log(fileName, lineNumber + 1, tokens);
            const code = generate(tokens);
            console.log(fileName, lineNumber + 1, code);
        } catch (error) {
            console.error(`${error.name}: ${error.message}`);
        }
    }
};
