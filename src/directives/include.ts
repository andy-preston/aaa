import type { OurContext } from "../context/mod.ts";
import { type GeneratedCode, newGenerator } from "../generate/mod.ts";
import { lineTokens, newLineLoader } from "../load-tokenise/mod.ts";
import type { ListingLine } from "../output/mod.ts";
import type { DirectiveConstructor, DirectiveHandler } from "./types.ts";

export const includeDirective = (
    listingLine: ListingLine
): DirectiveConstructor => {
    return (ourContext: OurContext): DirectiveHandler => {
        const loadLine = newLineLoader(ourContext);

        const generate = newGenerator(ourContext);

        return (fileName: string) => {
            let errorMessage = "";
            let code: GeneratedCode;
            const lines = Deno.readTextFileSync(fileName).split("\n").entries();
            for (const [lineNumber, rawLine] of lines) {
                const flashAddress = ourContext.flashPos();
                try {
                    errorMessage = "";
                    code = generate(lineTokens(loadLine(rawLine)));
                } catch (error) {
                    errorMessage = `${error.name}: ${error.message}`;
                    code = [];
                }
                listingLine(
                    fileName,
                    lineNumber,
                    flashAddress,
                    code,
                    rawLine,
                    errorMessage
                );
                if (!errorMessage) {
                    //hexFile(flashAddress, code);
                }
            }
        };
    };
};
