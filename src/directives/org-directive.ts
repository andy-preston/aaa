import { type OurContext } from "../context/mod.ts";

export const orgDirective = (ourContext: OurContext) =>
    (address: number) => {
        if (address < 0) {
            throw new Error("Addresses must be positive");
        }
        if (address > ourContext.theirs.programEnd) {
            throw new Error(
                `${address} beyond programEnd (${ourContext.theirs.programEnd})`
            );
        }
        ourContext.programMemoryPos = address;
    };
