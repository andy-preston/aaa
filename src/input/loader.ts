import type { OurContext } from "../context/mod.ts";
import type { Generate, GeneratedCode } from "../generate/mod.ts";
import type { ListingLine } from "../output/mod.ts";
import type { LineTokens } from "../tokens/mod.ts";
import type { LoadLine } from "./line-loader.ts";

type FileName = string;

type StackEntry = [FileName, IterableIterator<[number, string]>];

type Line = [FileName, number, string];

export const createLoader = (
    ourContext: OurContext,
    loadLine: LoadLine,
    lineTokens: LineTokens,
    generate: Generate,
    listingLine: ListingLine
) => {
    const fileStack: Array<StackEntry> = [];

    const include = (fileName: string) => {
        fileStack.push([
            fileName,
            Deno.readTextFileSync(fileName).split("\n").entries()
        ]);
    };

    const lines = function* (): Generator<Line, undefined, undefined> {
        let next: IteratorResult<[number, string]>;
        let thisFile: StackEntry;
        while (fileStack.length > 0) {
            const top = fileStack.length - 1;
            thisFile = fileStack[top]!;
            next = thisFile[1].next();
            if (next.done) {
                fileStack.pop();
            } else {
                const [lineNumber, text] = next.value;
                yield [thisFile[0], lineNumber, text];
            }
        }
    };

    const load = (fileName: string) => {
        include(fileName);
        let errorMessage: string;
        let code: GeneratedCode;
        for (const [fileName, lineNumber, rawLine] of lines()) {
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

    return {
        "include": include,
        "load": load
    };
};
