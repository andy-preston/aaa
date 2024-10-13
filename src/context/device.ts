import { InternalError } from "../errors/errors.ts";
import { setUnsupportedInstructions } from "../translate/mod.ts";
import { programMemoryBytes, setRamEnd, setRamStart } from "../state/mod.ts";
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

type FullSpec = Record<string, number | boolean | Array<string>>;

export const chooseDevice = (deviceName: string, fullSpec: FullSpec) => {
    if (name == deviceName) {
        return;
    }
    if (name != "") {
        throw new Error(`Device ${name} already chosen`);
    }
    newDeviceChecker();
    name = deviceName;
    for (const [key, value] of Object.entries(fullSpec)) {
        switch (key) {
            case "unsupportedInstructions":
                console.log("chooseDevice switch", value);
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

type RawProperty = string | boolean | Array<string>;
type RawItem = { "value": RawProperty };
type RawItems = Record<string, RawItem>;
type DeviceSpec = { "family"? : string, "spec": RawItems };

const loadJsonFile = (name: string) => {
    const json = Deno.readTextFileSync(name);
    return JSON.parse(json);
};

const hexNumber = (value: string): number => {
    const asNumber = parseInt(value, 16);
    const asHex = asNumber.toString(16).padStart(value.length, "0");
    if (asHex != value.toLowerCase()) {
        throw new InternalError(`expected ${value} to be a hex number`);
    }
    return asNumber;
};

export const deviceDirective = (name: string) => {
    const fullSpec: FullSpec = {};

    const loadSpec = (spec: RawItems) => {
        for (const [key, item] of Object.entries(spec)) {
            if (Object.hasOwn(fullSpec, key)) {
                throw new InternalError(
                    `${key} declared multiple times in ${name} spec`
                );
            }
            fullSpec[key] = typeof item.value != "string"
                ? item.value
                : hexNumber(item.value);
        }
    };

    const baseSpec: DeviceSpec = loadJsonFile(
        `./src/devices/${name.toLowerCase()}.json`
    );
    const familySpec: RawItems = "family" in baseSpec
        ? loadJsonFile(`./src/devices/families/${baseSpec.family}.json`)
        : {};
    loadSpec(baseSpec.spec);
    loadSpec(familySpec);
    chooseDevice(name, fullSpec);
};
