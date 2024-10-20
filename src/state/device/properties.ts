import { DeviceSelectionError } from "../../errors/errors.ts";
import { unsupportedInstructions } from "./unsupported-instructions.ts";

export const deviceProperties = () => {
    let deviceErrorShown = false;
    let deviceName = ""
    let reducedCore = false;
    const unsupported = unsupportedInstructions();

    const name = (reason: string) => {
        if (deviceName == "" && !deviceErrorShown) {
            deviceErrorShown = true;
            throw new DeviceSelectionError(reason);
        };
        return deviceName;
    };

    const hasReducedCore = () => {
        name("determine what kind of core you are using");
        return reducedCore;
    };

    const setReducedCore = (value: boolean) => {
        reducedCore = value;
    };

    const setDeviceName = (value: string) => {
        deviceName = value;
    };

    return {
        "setName": setDeviceName,
        "name": () => deviceName,
        "reducedCore": setReducedCore,
        "chooseUnsuuportedInstructions": unsupported.choose,
        "public": {
            "name": name,
            "hasReducedCore": hasReducedCore,
            "isUnsupported": unsupported.isUnsupported
        }
    };
};

export type DeviceProperties = ReturnType<typeof deviceProperties>;
