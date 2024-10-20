import type { ErrorWithHint } from "../errors/errors.ts";
import type { Line } from "../source-code/mod.ts";
import type { CodeBlock } from "../translate/mod.ts";
import type { File } from "./file.ts";

const addressWidth = 5;
const objectWidth = 11;

const object = (block: CodeBlock) => {
    const addressHex = block.address
        .toString(16)
        .toUpperCase()
        .padStart(addressWidth, "0");
    const object = block.code
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(" ")
        .toUpperCase()
        .padEnd(objectWidth, " ");
    return `${addressHex} ${object}`;
};

const arrow = ">".repeat(addressWidth + 1 + objectWidth);

export const openListing = (file: File) => {
    let newLine = false;
    let sourceLine = "";
    let currentLine = 0;
    let currentFile = "";

    const numberedLine = (sourceLine: string) => {
        const line = `${currentLine + 1}`.padStart(4, " ");
        return `${line} ${sourceLine}`;
    };

    const source = (line: Line) => {
        if (line.filename != currentFile) {
            const underline = "=".repeat(line.filename.length);
            file.write(`\n${line.filename}\n${underline}\n`);
            currentFile = line.filename;
        }
        currentLine = line.lineNumber;
        sourceLine = line.rawLine;
        newLine = true;
    };

    const error = (error: ErrorWithHint) => {
        const humanName = error.name.replace(/([A-Z])/g, " $1").trim();
        const message = `${humanName}: ${error.message}`;
        file.write(`${arrow} ${numberedLine(message)}`);
        if (error.hint) {
            file.write(`${arrow} ${numberedLine(error.hint)}`);
        }
    };

    const codeBlock = (block: CodeBlock) => {
        if (newLine || block.code.length > 0) {
            file.write(`${object(block)} ${numberedLine(sourceLine)}`);
            sourceLine = "";
            newLine = false;
        }
    };

    return {
        "codeBlock": codeBlock,
        "source": source,
        "error": error
    }
};
