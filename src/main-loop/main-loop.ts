import { newContext } from "../context/mod.ts";
import { GeneratedCode, newGenerator } from "../generate/mod.ts";
import { lineTokens, newLineLoader } from "../load-tokenise/mod.ts";

const context = newContext();
const loadLine = newLineLoader(context);
const generate = newGenerator(context);

////////////////////////////////////////////////////////////////////////////////
//
// Stand ins for incomplete modules
//
////////////////////////////////////////////////////////////////////////////////

const listingLine = (
    lineNumber: number,
    sourceLine: string,
    error: string,
    code: GeneratedCode
) => {
    console.log(lineNumber, sourceLine, code);
    console.log(error);
};

const hexFile = (flashAddress: number, code: GeneratedCode) => {
    console.log(flashAddress, code);
};

////////////////////////////////////////////////////////////////////////////////

const includedFile = (line: string) =>
    line.replace(".include", "").trim();

export const load = (fileName: string) => {
    let errorMessage = "";
    let code: GeneratedCode = [];
    const lines = Deno.readTextFileSync(fileName).split("\n").entries();
    for (const [lineNumber, rawLine] of lines) {
        if (rawLine.includes(".include")) {
            listingLine(lineNumber, rawLine, "", []);
            load(includedFile(rawLine));
            continue;
        }
        const flashAddress = context.flashPos();
        try {
            errorMessage = "";
            code = generate(lineTokens(loadLine(rawLine)));
        } catch (error) {
            errorMessage = `${error.name}: ${error.message}`;
            code = [];
        }
        listingLine(lineNumber, rawLine, errorMessage, code);
        if (!errorMessage) {
            hexFile(flashAddress, code);
        }
    }
};
