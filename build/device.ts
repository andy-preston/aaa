import { xml_node } from "@libs/xml";
import { lowerCaseAttribute } from "./xml.ts";
import { type AllSpaces, memory } from "./memory.ts";

export type Device = {
    "architecture": string,
    "memory": AllSpaces,
    "interrupts": Array<string>
};

////////////////////////////////////////////////////////////////////////////////
//
// Some ATDFs have "holes" in the interrupt specification (most notably)
// interrupt 0 - this needs investigation
//
////////////////////////////////////////////////////////////////////////////////
const interrupts = (interruptsXml: xml_node) => {
    const result: Array<string> = [];
    for (const interrupt of interruptsXml["~children"]) {
        const index = parseInt(lowerCaseAttribute(interrupt, "index"));
        result[index] = lowerCaseAttribute(interrupt, "name")
    }
    return result;
};

export const device = (
    deviceXml: xml_node,
    noRam: boolean
): Device => {
    return {
        "architecture": lowerCaseAttribute(deviceXml, "architecture"),
        "memory": memory(deviceXml["address-spaces"] as xml_node, noRam),
        "interrupts": interrupts(deviceXml["interrupts"] as xml_node)
    };
};
