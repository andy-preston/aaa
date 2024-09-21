import { Mnemonic } from "../source-line/mod.ts";
import { OurContext } from "./mod.ts";

export const deviceChecker = (ourContext: OurContext) => {
    let deviceErrorShown = false;

    return (mnemonic: Mnemonic): string => {
        if (mnemonic && ourContext.device == "" && !deviceErrorShown) {
            deviceErrorShown = true;
            return "No device selected";
        }
        if (ourContext.unsupportedInstructions.includes(mnemonic)) {
            return `${mnemonic} is not available on ${ourContext.device}`;
        }
        return "";
    }
};
