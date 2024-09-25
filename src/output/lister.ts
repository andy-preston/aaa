import type { GeneratedCode } from "../generate/mod.ts";
import type { FileName } from "../input/file-loader.ts";
import type { OutputWriteLine } from "./file.ts";

export const lister = (writeLine: OutputWriteLine) => {
    const addressWidth = 5;
    const objectWidth = 11;
    let currentFile = "";
    let currentLine = 0;
    let sourceLine = "";
    let newLine = false;

    const source = (file: FileName, line: number, text: string) => {
        if (file != currentFile) {
            const underline = "=".repeat(file.length);
            writeLine(`\n${file}\n${underline}\n`);
            currentFile = file;
        }
        currentLine = line;
        sourceLine = text;
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

    const error = (message: string) => {
        writeLine(`${arrow} ${numberedLine(message)}`);
    }

    const code = (address: number, bytes: GeneratedCode) => {
        if (newLine || bytes.length > 0) {
            writeLine(
                `${object(address, bytes)} ${numberedLine(sourceLine)}`
            );
            sourceLine = "";
            newLine = false;
        }
    };

    return { "source": source, "error": error, "code": code };
};

export type Lister = ReturnType<typeof lister>;
