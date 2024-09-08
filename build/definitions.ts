import { deviceAndModulesXml } from "./device-and-modules-xml.ts";
import { type Device, device } from "./device.ts";
import { type Module, modules } from "./modules.ts";

type Definition = {
    "device": Device | undefined,
    "modules": Array<Module> | undefined
};

const path = "./build/atdf";
for (const entry of Deno.readDirSync(path)) {
    const fileName = `${path}/${entry.name}`;
    if (fileName.endsWith(".atdf")) {
        const chipName = entry.name.split(".")[0]!.toLowerCase();
        const noRam = ["attiny11", "attiny12", "attiny15"].includes(chipName);
        const definition: Definition = {
            "device": undefined,
            "modules": undefined,
        }
        const [deviceXml, modulesXml] = deviceAndModulesXml(fileName);
        try {
            definition.device = device(deviceXml!, noRam);
            definition.modules = modules(modulesXml!);
        }
        catch (error) {
            console.error(fileName);
            throw error;
        }
        //break;
    }
}
