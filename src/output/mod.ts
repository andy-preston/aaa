import type { GeneratedCode } from "../generate/mod.ts";
import type { FileName } from "../input/mod.ts";
import { outputFile } from "./file.ts";
import { lister } from "./lister.ts";

export const outputter = (fileName: FileName) => {
    const listFile = outputFile(fileName, ".lst");
    const listing = lister(listFile);

    const output = (
        sourceFile: FileName,
        lineNumber: number,
        address: number,
        generatedCode: GeneratedCode,
        source: string,
        errorMessage: string
    ) => {
        listing(
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
            listFile.close();
        }
    };
};

export type Output = ReturnType<typeof outputter>["output"];
