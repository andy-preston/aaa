import { setUnsupportedInstructions } from "../generate/mod.ts";
import { programMemoryBytes, setRamEnd, setRamStart } from "../process/mod.ts";
import { property } from "./context.ts";

let deviceErrorShown: boolean;
let reducedCore: boolean;
let name: string;

export const newDeviceChecker = () => {
    deviceErrorShown = false;
    reducedCore = false;
    name = "";
};

export const deviceName = (reason: string) => {
    if (name == "" && !deviceErrorShown) {
        deviceErrorShown = true;
        throw new Error(
            `Without a device selected, it's not possible to ${reason}`
        );
    };
    return name;
};

export const hasReducedCore = () => reducedCore;

export const chooseDevice = (deviceName: string, deviceSpec: object) => {
    if (name == deviceName) {
        return;
    }
    if (name != "") {
        throw new Error(`Device ${name} already chosen`);
    }
    newDeviceChecker();
    name = deviceName;
    for (const [key, value] of Object.entries(deviceSpec)) {
        switch (key) {
            case "unsupportedInstructions":
                setUnsupportedInstructions(value as Array<string>);
                break;
            case "reducedCore":
                reducedCore = value as boolean;
                break;
            case "programEnd":
                programMemoryBytes(value as number);
                break;
            case "ramStart":
                setRamStart(value as number);
                break;
            case "ramEnd":
                setRamEnd(value as number);
                break;
            default:
                property(key, value as number);
                break;
        }
    }
};

export const deviceDirective = (name: string) => {
    (async () => {
        const deviceSpec = await import(`../devices/${name.toLowerCase()}.ts`);
        chooseDevice(name, deviceSpec);
    })();
};
