import { OurContext } from "../context/mod.ts";
import { SymbolicOperands } from "../operands/mod.ts";
import { lineLoader } from "./line-loader.ts";
import { lineTokens, type Mnemonic } from "./tokens.ts";

export type Instruction = [Mnemonic, SymbolicOperands]

export const sourceLine = (ourContext: OurContext) => {
    const loadLine = lineLoader(ourContext);
    return (rawLine: string): Instruction => {
        const [label, mnemonic, operands] = lineTokens(loadLine(rawLine));
        if (label != "") {
            ourContext.label(label);
        }
        return [mnemonic, operands];
    }
};
