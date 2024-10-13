import type { SymbolicOperands } from "../operands/mod.ts";
import type { Label, Line, Mnemonic } from "./line.ts";

export type TestTokens = [Label, Mnemonic, SymbolicOperands];

export const tokenLine = (
    label: Label,
    mnemonic: Mnemonic,
    operands: SymbolicOperands
): Line => ({
    "filename": "",
    "lineNumber": 0,
    "rawLine": "",
    "assemblyLine": "",
    "label": label,
    "mnemonic": mnemonic,
    "operands": operands
});

