import type { GeneratedCode } from "../generate/mod.ts";
import type { FileName } from "../input/mod.ts";
import type { OutputWriteLine } from "./file.ts";

export const lister = (writeLine: OutputWriteLine) => {
    let currentFileName = "";
    const addressWidth = 5;
    const objectWidth = 11;

    const listFileName = (name: FileName) => {
        if (name != currentFileName) {
            const underline = "=".repeat(name.length);
            writeLine(`\n${name}\n${underline}\n`);
            currentFileName = name;
        }
    };

    const source = (lineNumber: number, sourceLine: string) => {
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

    return (
        sourceFile: FileName,
        lineNumber: number,
        address: number,
        code: GeneratedCode,
        sourceLine: string,
        errorMessage: string
    ) => {
        listFileName(sourceFile);
        writeLine(`${object(address, code)} ${source(lineNumber, sourceLine)}`);
        if (errorMessage != "") {
            writeLine(`${arrow} ${source(lineNumber, errorMessage)}`);
        }
    };
};
