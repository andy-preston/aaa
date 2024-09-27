import { chooseDevice } from "../context/mod.ts";

export const deviceDirective = (name: string) => {
    (async () => {
        chooseDevice(
            name,
            await import(`../devices/${name.toLowerCase()}.ts`)
        );
    })();
};
