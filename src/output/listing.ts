import type { Line } from "../source-code/mod.ts";
import type { GeneratedCode } from "../translate/mod.ts";
import type { WriteFile } from "./file.ts";

const addressWidth = 5;
const objectWidth = 11;

let currentFile: string;
let currentLine: number;
let sourceLine: string;
let newLine: boolean;
let writeFile: WriteFile;

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

export const newListing = (writeFileFunc: WriteFile) => {
    writeFile = writeFileFunc;
    newLine = false;
    sourceLine = "";
    currentLine = 0;
    currentFile = "";
};

export const listSource = (line: Line) => {
    if (line.filename != currentFile) {
        const underline = "=".repeat(line.filename.length);
        writeFile(`\n${line.filename}\n${underline}\n`);
        currentFile = line.filename;
    }
    currentLine = line.lineNumber;
    sourceLine = line.rawLine;
    newLine = true;
};

export const listError = (message: string) => {
    writeFile(`${arrow} ${numberedLine(message)}`);
};

export const listCode = (address: number, bytes: GeneratedCode) => {
    if (newLine || bytes.length > 0) {
        writeFile(`${object(address, bytes)} ${numberedLine(sourceLine)}`);
        sourceLine = "";
        newLine = false;
    }
};
