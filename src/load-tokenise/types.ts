import { SymbolicOperands } from "../operands/mod.ts";

export type Mnemonic = string;

type Label = string;

export type Tokens = [Label, Mnemonic, SymbolicOperands];
