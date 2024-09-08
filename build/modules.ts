import { xml_node } from "@libs/xml";
import { attribute } from "./xml.ts";

type BitField = {
    "name": string,
    "longName": string | undefined,
    "mask": string
};

type Register = {
    "name": string,
    "offset": string,
    "size": string,
    "bitFields": Array<BitField>
};

type RegisterGroup = {
    "name": string,
    "registers": Array<Register>
};

export type Module = {
    "name": string,
    "registerGroups": Array<RegisterGroup>
};

const register = (registerXml: xml_node): Array<BitField> => {
    const results: Array<BitField> = [];
    for (const bitFieldXml of registerXml["~children"]) {
        if (bitFieldXml["~name"] == "bitfield") {
            results.push({
                "name": attribute(bitFieldXml, "name"),
                "longName": attribute(bitFieldXml, "values"),
                "mask": attribute(bitFieldXml, "mask")
            });
        }
    }
    return results;
};

const registerGroup = (groupXml: xml_node): Array<Register> => {
    const result: Array<Register> = [];
    for (const registerXml of groupXml["~children"]) {
        if (registerXml["~name"] == "register") {
            result.push({
                "name": attribute(registerXml, "name"),
                "offset": attribute(registerXml, "offset"),
                "size": attribute(registerXml, "size"),
                "bitFields": register(registerXml as xml_node)
            });
        }
    }
    return result;
};

const module = (moduleXml: xml_node) => {
    const result: Array<RegisterGroup> = [];
    for (const groupXml of moduleXml["~children"]) {
        if (groupXml["~name"] == "register-group") {
            result.push({
                "name": attribute(groupXml, "name"),
                "registers": registerGroup(groupXml as xml_node)
            });
        }
    }
    return result;
};

export const modules = (modulesXml: xml_node): Array<Module> => {
    const result: Array<Module> = [];
    for (const moduleXml of modulesXml["~children"]) {
        if (moduleXml["~name"] == "module") {
            const name = attribute(moduleXml, "name");
            if (!["fuse", "lockbit"].includes(name.toLowerCase())) {
                result.push({
                    "name": name,
                    "registerGroups": module(moduleXml as xml_node)
                });
            }
        }
    }
    return result;
};
