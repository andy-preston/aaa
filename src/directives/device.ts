import { type OurContext, defineProperty } from "../context/mod.ts";

export const deviceDirective = (ourContext: OurContext) =>
    (name: string): void => {
        if (ourContext.device != "") {
            throw new Error(`Device ${ourContext.device} already chosen`);
        }
        ourContext.device = name;
        (async () => {
            const device = await import(`./devices/${name.toLowerCase()}.ts`);
            for (const [key, value] of Object.entries(device)) {
                if (key == "unsupportedInstructions") {
                    ourContext.unsupportedInstructions = value as Array<string>;
                } else {
                    defineProperty(ourContext.theirs, key, value as number);
                }
            }
        })();
    };
