import type { GeneratedCode } from "../generate/mod.ts";
import type { FileName } from "../input/mod.ts";
import type { OutputWriteLine } from "./file.ts";

export const lister = (writeLine: OutputWriteLine) => {
    const addressWidth = 5;
    const objectWidth = 11;
    let currentFileName = "";
    let lineNumber = 0;
    let sourceLine = "";

    const sourceFile = (name: FileName, line: number, source: string) => {
        if (name != currentFileName) {
            const underline = "=".repeat(name.length);
            writeLine(`\n${name}\n${underline}\n`);
            currentFileName = name;
        }
        lineNumber = line;
        sourceLine = source;
    };

    const numberedLine = (lineNumber: number, sourceLine: string) => {
        const line = `${lineNumber + 1}`.padStart(4, " ");
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
        writeLine(
            `${object(address, code)} ${numberedLine(lineNumber, sourceLine)}`
        );
        if (errorMessage != "") {
            writeLine(`${arrow} ${numberedLine(lineNumber, errorMessage)}`);
        }
    };

    return { "sourceFile": sourceFile, "aLine": aLine };
};
