import { type OurContext } from "../context/mod.ts";

export const deviceDirective = (ourContext: OurContext) =>
    (name: string) => {
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
                    addProperty(ourContext.theirs, key, value as number);
                }
            }
        })();
    };
