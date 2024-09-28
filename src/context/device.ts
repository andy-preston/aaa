import type { Mnemonic } from "../source-code/mod.ts";
import { TheirContext } from "./mod.ts";
import { addProperty } from "./their-context.ts";

let deviceErrorShown: boolean;
let unsupportedInstructions: Array<string>;
let reducedCore: boolean;
let deviceName: string;
let theirs: TheirContext;

export const newDeviceChecker = (theirContext: TheirContext) => {
    deviceErrorShown = false;
    unsupportedInstructions = [];
    reducedCore = false;
    deviceName = "";
    theirs = theirContext;
};

export const deviceCheck = (mnemonic: Mnemonic): string => {
    if (mnemonic && deviceName == "" && !deviceErrorShown) {
        deviceErrorShown = true;
        return "No device selected";
    }
    if (unsupportedInstructions.includes(mnemonic)) {
        return `${mnemonic} is not available on ${deviceName}`;
    }
    return "";
};

export const hasReducedCore = () => reducedCore;

export const chooseDevice = (name: string, deviceSpec: object) => {
    if (deviceName == name) {
        return;
    }
    if (deviceName != "") {
        throw new Error(`Device ${deviceName} already chosen`);
    }
    newDeviceChecker(theirs);
    deviceName = name;
    for (const [key, value] of Object.entries(deviceSpec)) {
        switch (key) {
            case "unsupportedInstructions":
                unsupportedInstructions = value as Array<string>;
                break;
            case "reducedCore":
                reducedCore = value as boolean;
                break;
            case "programEnd":
                addProperty(theirs, key, Math.floor(value as number / 2));
                break;
            default:
                addProperty(theirs, key, value as number);
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
