import type { GeneratedCode } from "../generate/mod.ts";
import type { FileName } from "../input/mod.ts";
import { lister } from "./lister.ts";

export const outputter = (fileName: FileName) => {
    const listing = lister(fileName);

    const output = (
        sourceFile: string,
        lineNumber: number,
        address: number,
        generatedCode: GeneratedCode,
        source: string,
        errorMessage: string
    ) => {
        listing.line(
            sourceFile,
            lineNumber,
            address,
            generatedCode,
            source,
            errorMessage
        );
        if (!errorMessage) {
            //hexFile(flashAddress, code);
        }
    };

    return {
        "output": output,
        "close": () => {
            listing.close();
        }
    };
};

export type Output = ReturnType<typeof outputter>["output"];
