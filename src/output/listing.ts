import type { ErrorWithHints } from "../errors/errors.ts";
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

const padding = (pad: ">" | " ") => pad.repeat(addressWidth + 1 + objectWidth);

export const openListing = (file: File) => {
    let newLine = false;
    let rawLine = "";
    let currentLine = 0;
    let currentFile = "";

    const numberedLine = (rawLine: string) => {
        const line = `${currentLine + 1}`.padStart(4, " ");
        return `${line} ${rawLine}`;
    };

    const sourceLine = (objectCode: string) => {
        file.write(`${objectCode.padEnd(objectWidth)} ${numberedLine(rawLine)}`);
        rawLine = "";
        newLine = false;
    };

    const errorLine = (message: string) => {
        file.write(`${padding(">")} ${numberedLine(message)}`);
    };

    const source = (line: Line) => {
        if (newLine) {
            sourceLine(padding(" "));
        }
        if (line.filename != currentFile) {
            const underline = "=".repeat(line.filename.length);
            file.write(`\n${line.filename}\n${underline}\n`);
            currentFile = line.filename;
        }
        currentLine = line.lineNumber;
        rawLine = line.rawLine;
        newLine = true;
    };

    const error = (error: ErrorWithHints) => {
        if (newLine) {
            sourceLine(padding(" "));
        }
        const humanName = error.name.replace(/([A-Z])/g, " $1").trim();
        errorLine(`${humanName}: ${error.message}`);
        if (error.hint) {
            errorLine(error.hint);
        }
    };

    const codeBlock = (block: CodeBlock) => {
        block.errors.forEach(errorObject => {
            error(errorObject);
        });
        if (block.code.length > 0) {
            sourceLine(object(block));
        }
    };

    return {
        "codeBlock": codeBlock,
        "source": source
    };
};
