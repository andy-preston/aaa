import type { OurContext } from "../context/mod.ts";
import type { Generate, GeneratedCode } from "../generate/mod.ts";
import type { Output } from "../output/mod.ts";
import type { LineTokens } from "../tokens/mod.ts";
import { fileStack } from "./file-stack.ts";
import type { LoadLine } from "./line-loader.ts";
import type { FileName } from "./types.ts";

type Line = [FileName, number, string];

export const fileLoader = (
    ourContext: OurContext,
    loadLine: LoadLine,
    lineTokens: LineTokens,
    generate: Generate,
    output: Output
) => {
    const files = fileStack();

    const lines = function* (): Generator<Line, undefined, undefined> {
        let next: IteratorResult<[number, string]>;
        let file = files.file();
        while (file != undefined) {
            next = file[1].next();
            if (next.done) {
                files.drop();
            } else {
                const [lineNumber, text] = next.value;
                yield [file[0], lineNumber, text];
            }
            file = files.file();
        }
    };

    const load = (fileName: string) => {
        files.add(fileName);
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
            output(
                fileName,
                lineNumber,
                flashAddress,
                code,
                rawLine,
                errorMessage
            );
        }
    };

    return {
        "include": files.add,
        "load": load
    };
};
