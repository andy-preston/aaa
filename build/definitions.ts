import { deviceAndModulesXml } from "./device-and-modules-xml.ts";
import { DeviceSpecification, device } from "./device.ts";

type Definition = {
    "device": DeviceSpecification | undefined,
    "modules": undefined
};

const path = "./build/atdf";
for (const entry of Deno.readDirSync(path)) {
    const fileName = `${path}/${entry.name}`;
    if (fileName.endsWith(".atdf")) {
        const [deviceXml, _modulesXml] = deviceAndModulesXml(fileName);
        const chipName = entry.name.split(".")[0]!.toLowerCase();
        const noRam = ["attiny11", "attiny12", "attiny15"].includes(chipName);
        const definition: Definition = {
            "device": undefined,
            "modules": undefined,
        }
        try {
            definition.device = device(deviceXml!, noRam);
            //console.log(definition);
        }
        catch (error) {
            console.error(fileName);
            throw error;
        }
        //break;
    }
}
