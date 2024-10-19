import { property } from "../context/mod.ts";
import { InternalError } from "../errors/errors.ts";
import { setUnsupportedInstructions } from "../translate/translate.ts";
import type { DataMemory } from "./data-memory.ts";
import type { DeviceProperties } from "./device-properties.ts";
import type { ProgramMemory } from "./program-memory.ts";

type FullSpec = Record<string, number | boolean | Array<string>>;
type RawProperty = string | boolean | Array<string>;
type RawItem = { "value": RawProperty };
type RawItems = Record<string, RawItem>;
type DeviceSpec = { "family"? : string, "spec": RawItems };

export const deviceChooser = (
    properties: DeviceProperties,
    program: ProgramMemory,
    data: DataMemory
) => {
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

    const choose = (deviceName: string, fullSpec: FullSpec) => {
        const previousName = properties.name();
        if (previousName == deviceName) {
            return;
        }
        if (previousName != "") {
            throw new Error(`Device ${name} already chosen`);
        }
        properties.setName(deviceName);
        for (const [key, value] of Object.entries(fullSpec)) {
            switch (key) {
                case "unsupportedInstructions":
                    setUnsupportedInstructions(value as Array<string>);
                    break;
                case "reducedCore":
                    properties.reducedCore(value as boolean);
                    break;
                case "programEnd":
                    console.log("choose programEnd", value);
                    program.bytes(value as number);
                    break;
                case "ramStart":
                    data.ramStart(value as number);
                    break;
                case "ramEnd":
                    data.ramEnd(value as number);
                    break;
                default:
                    property(key, value as number);
                    break;
            }
        }
    };

    const directive = (name: string) => {
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
        choose(name, fullSpec);
    };

    return {
        "choose": choose,
        "directive": directive
    };
};
