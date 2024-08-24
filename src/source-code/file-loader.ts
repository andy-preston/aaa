import { newContext } from "../context/mod.ts";
import { newGenerator } from "../generate/mod.ts";
import { lineTokens } from "../tokens/tokens.ts";
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
        const line = loadLine(rawLine);
        const tokens = lineTokens(line);
        const code = generate(tokens);
    }
};
