import { type OurContext } from "../context/mod.ts";

export const deviceDirective = (ourContext: OurContext) =>
    (name: string) => {
        if (ourContext.device == name) {
            return;
        }
        if (ourContext.device != "") {
            throw new Error(`Device ${ourContext.device} already chosen`);
        }
        ourContext.device = name;
        (async () => {
            ourContext.chooseDevice(
                await import(`../devices/${name.toLowerCase()}.ts`)
            );
        })();
    };
