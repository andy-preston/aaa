import { OurContext } from "../context/mod.ts";
import { SymbolicOperands } from "../operands/mod.ts";
import { lineLoader } from "./line-loader.ts";
import { lineTokens, type Mnemonic } from "./tokens.ts";

export type Instruction = [Mnemonic, SymbolicOperands]

export const sourceLine = (ourContext: OurContext) => {
    const loadLine = lineLoader(ourContext);
    let deviceErrorShown = false;
    return (rawLine: string): Instruction => {
        const [label, mnemonic, operands] = lineTokens(loadLine(rawLine));
        if (label != "") {
            ourContext.label(label);
        }
        if (mnemonic && ourContext.device == "" && !deviceErrorShown) {
            deviceErrorShown = true;
            throw new Error("No device selected");
        }
        if (ourContext.unsupportedInstructions.includes(mnemonic)) {
            throw new Error(
                `${mnemonic} is not available on ${ourContext.device}`
            );
        }
        return [mnemonic, operands];
    }
};
