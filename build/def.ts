import { type xml_node } from "xml";
import { spec } from "./spec.ts";
import { addressSpaces } from "./memory.ts";

const deviceInfo = (device: xml_node) => {
    const _architecture = device["@architecture"];
    const _memory = addressSpaces(device["address-spaces"] as xml_node);
    /*
    peripherals
    interrupts
    interfaces
    property-groups
    */
    return null;
}

const path = "./build/atdf";
for (const entry of Deno.readDirSync(path)) {
    const fileName = `${path}/${entry.name}`;
    if (fileName.endsWith(".atdf")) {
        const [deviceSpec, _modulesSpec] = spec(fileName);
        try {
            const _device = deviceInfo(deviceSpec!);
        }
        catch (error) {
            console.error(fileName);
            throw error;
        }
        break;
    }
}
