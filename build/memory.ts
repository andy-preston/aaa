import type { xml_node } from "@libs/xml";
import { lowerCaseAttribute } from "./xml.ts";

type SpaceAttributes = "start" | "size";

type AddressSpace = Record<SpaceAttributes, string>;

type DataSpaceName = "mappedIO" | "internalRam";

const dataSpaceNames: Record <string, DataSpaceName> = {
    "mapped_io": "mappedIO",
    "io": "mappedIO",
    "iram": "internalRam",
    "internal_sram": "internalRam",
    "sram": "internalRam"
};

type DataSpaces = Record<DataSpaceName, AddressSpace>;

type TemporaryDataSpaces = Record<DataSpaceName, AddressSpace | undefined>;

type AllSpaceName = DataSpaceName | "programMemory" | "io";

export type AllSpaces = Record<AllSpaceName, AddressSpace>;

type TemporarySpaces = Record<AllSpaceName, AddressSpace | undefined>;

const addressSpace = (memorySegment: xml_node): AddressSpace => {
    return {
        "start": lowerCaseAttribute(memorySegment, "start"),
        "size": lowerCaseAttribute(memorySegment, "size")
    };
};

const programMemory = (programMemoryXml: xml_node): AddressSpace => {
    for (const segment of programMemoryXml["~children"]) {
        if (segment["~name"] == "memory-segment") {
            const name = lowerCaseAttribute(segment as xml_node, "name");
            if (["flash", "progmem"].includes(name)) {
                return addressSpace(segment as xml_node);
            }
        }
    }
    throw new Error("didn't find program memory");
};

const dataMemory = (dataMemoryXml: xml_node, noRam: boolean): DataSpaces => {
    const result: TemporaryDataSpaces = {
        "mappedIO": undefined,
        "internalRam": undefined
    };
    for (const memorySegment of dataMemoryXml["~children"]) {
        if (memorySegment["~name"] == "memory-segment") {
            const dataSpaceName = dataSpaceNames[
                lowerCaseAttribute(memorySegment, "name")
            ];
            if (dataSpaceName != undefined) {
                result[dataSpaceName] = addressSpace(memorySegment as xml_node);
            }
        }
    }
    if (noRam) {
        result["internalRam"] = {"start": "0", "size": "0"};
    }
    for (const space in result) {
        if (result[space as DataSpaceName] == undefined) {
            throw new Error(`didn't find ${space} in data address space`);
        }
    }
    return result as DataSpaces;
};

export const memory = (
    addressSpaces: xml_node,
    noRam: boolean
): AllSpaces => {
    const spaces: TemporarySpaces = {
        "programMemory": undefined,
        "mappedIO": undefined,
        "internalRam": undefined,
        "io": undefined
    };
    for (const space of addressSpaces["~children"]) {
        if (space["~name"] == "address-space") {
            switch (lowerCaseAttribute(space, "name")) {
                case "prog":
                    spaces.programMemory = programMemory(space as xml_node);
                    break;
                case "data":
                    Object.assign(spaces, dataMemory(space as xml_node, noRam));
                    break;
                case "io":
                    spaces.io = addressSpace(space as xml_node);
                    break;
            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    //
    // Some of the ATDFs don't include an IO space. I'm not sure if this is
    // important or not. I'm leaving it until later in my exploration to decide
    // and, for now, I'm just letting this "error" pass.
    //
    ////////////////////////////////////////////////////////////////////////////
    for (const space in spaces) {
        if (space != "io" && spaces[space as AllSpaceName] == undefined) {
            throw new Error(`didn't find ${space} in memory spaces`);
        }
    }
    return spaces as AllSpaces;
};
