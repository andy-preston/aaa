export const deviceProperties = () => {
    let deviceErrorShown = false;
    let reducedCore = false;
    let deviceName = ""

    const name = (reason: string) => {
        if (deviceName == "" && !deviceErrorShown) {
            deviceErrorShown = true;
            throw new Error(
                `Without a device selected, it's not possible to ${reason}`
            );
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
        "public": {
            "name": name,
            "hasReducedCore": hasReducedCore
        }
    };
};

export type DeviceProperties = ReturnType<typeof deviceProperties>;
