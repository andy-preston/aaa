import type { FileName } from "../coupling/coupling.ts";
import type { SymbolicOperands } from "../operands/mod.ts";

export type LineNumber = number;

export type RawSource = string;

export type Mnemonic = string;

export type Label = string;

export const newLine = (
    filename: FileName,
    lineNumber: LineNumber,
    rawLine: RawSource
) => ({
    "filename": filename,
    "lineNumber": lineNumber,
    "rawLine": rawLine,
    "assemblyLine": ("" as RawSource),
    "label": ("" as Label),
    "mnemonic": ("" as Mnemonic),
    "operands": ([] as SymbolicOperands)
});

export type Line = ReturnType<typeof newLine>;

export type LineGenerator = Generator<Line, undefined, undefined>;
