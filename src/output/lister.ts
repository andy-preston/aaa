import type { GeneratedCode } from "../generate/mod.ts";
import type { FileName } from "../input/mod.ts";
import type { OutputWriteLine } from "./file.ts";

export const lister = (writeLine: OutputWriteLine) => {
    const addressWidth = 5;
    const objectWidth = 11;
    let currentFile = "";
    let currentLine = 0;
    let sourceLine = "";
    let newLine = false;

    const sourceFile = (file: FileName, line: number, source: string) => {
        if (file != currentFile) {
            const underline = "=".repeat(file.length);
            writeLine(`\n${file}\n${underline}\n`);
            currentFile = file;
        }
        currentLine = line;
        sourceLine = source;
        newLine = true;
    };

    const numberedLine = (sourceLine: string) => {
        const line = `${currentLine + 1}`.padStart(4, " ");
        return `${line} ${sourceLine}`;
    };

    const object = (address: number, code: GeneratedCode) => {
        const addressHex = address
            .toString(16)
            .toUpperCase()
            .padStart(addressWidth, "0");
        const object = code
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join(" ")
            .toUpperCase()
            .padEnd(objectWidth, " ");
        return `${addressHex} ${object}`;
    };

    const arrow = ">".repeat(addressWidth + 1 + objectWidth);

    const aLine = (
        address: number,
        code: GeneratedCode,
        errorMessage: string
    ) => {
        if (newLine || code.length > 0) {
            writeLine(
                `${object(address, code)} ${numberedLine(sourceLine)}`
            );
            sourceLine = "";
            newLine = false;
        }
        if (errorMessage != "") {
            writeLine(`${arrow} ${numberedLine(errorMessage)}`);
        }
    };

    return { "sourceFile": sourceFile, "aLine": aLine };
};
