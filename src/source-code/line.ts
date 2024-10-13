import { Pass } from "../process/pass.ts";
import { FileName } from "./mod.ts";

export type LineNumber = number;

export type RawSource = string;

export const newLine = (
    pass: Pass,
    filename: FileName,
    lineNumber: LineNumber,
    rawLine: RawSource,
) => {
    return {
        "pass": pass,
        "filename": filename,
        "lineNumber": lineNumber,
        "rawLine": rawLine
    };
};

export type Line = ReturnType<typeof newLine>;
