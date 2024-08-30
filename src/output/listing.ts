import type { GeneratedCode } from "../generate/mod.ts";
import { newFile } from "./file.ts";

export const newListing = (topFileName: string) => {
    let currentFileName = "";

    const theFile = newFile(topFileName, ".lst");

    const listFileName = (name: string) => {
        if (name != currentFileName) {
            theFile.writeLine(`\n${name}\n${"=".repeat(name.length)}\n`);
            currentFileName = name;
        }
    };

    const line = (
        sourceFile: string,
        lineNumber: number,
        address: number,
        generatedCode: GeneratedCode,
        source: string,
        errorMessage: string
    ) => {
        listFileName(sourceFile);
        const lineNumberString = `${lineNumber + 1}`.padStart(4, " ");
        const addressString = address
            .toString(16)
            .padStart(5, "0")
            .toUpperCase();
        const object = generatedCode
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join(" ")
            .padEnd(11, " ")
            .toUpperCase();
        theFile.writeLine(
            `${addressString} ${object} ${lineNumberString} ${source}`
        );
        if (errorMessage != "") {
            theFile.writeLine(
                `${">".repeat(17)} ${lineNumberString} ${errorMessage}`
            );
        }
    };

    return { "line": line, "close": theFile.close };
};

export type Listing = ReturnType<typeof newListing>;

export type ListingLine = Listing["line"];
