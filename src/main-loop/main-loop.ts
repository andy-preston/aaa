import { newContext } from "../context/mod.ts";
import { GeneratedCode, newGenerator } from "../generate/mod.ts";
import { lineTokens, newLineLoader } from "../load-tokenise/mod.ts";
import { newListing } from "./listing.ts";

export const loader = (topFileName: string) => {
    const context = newContext();
    const loadLine = newLineLoader(context);
    const generate = newGenerator(context);
    const listing = newListing();

    const includedFile = (line: string) =>
        line.replace(".include", "").trim();

    const load = (fileName: string) => {
        let errorMessage = "";
        let code: GeneratedCode = [];
        const lines = Deno.readTextFileSync(fileName).split("\n").entries();
        for (const [lineNumber, rawLine] of lines) {
            if (rawLine.includes(".include")) {
                listing.add(fileName, lineNumber, 0, [], rawLine, "");
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
            listing.add(fileName, lineNumber, flashAddress, code, rawLine, errorMessage);
            if (!errorMessage) {
                //hexFile(flashAddress, code);
            }
        }
    };

    load(topFileName);
    listing.write(topFileName);
};
