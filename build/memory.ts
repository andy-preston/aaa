import { type xml_node } from "xml";
import { attribute } from "./xml.ts";

type SpaceAttributes = "start" | "size";

type AddressSpace = Record<SpaceAttributes, string>;

type DataSpaceName = "registers" | "mappedIO" | "internalRam";

const dataSpaceNames: Record <string, DataSpaceName> = {
    "registers": "registers",
    "mapped_io": "mappedIO",
    "iram": "internalRam"
};

type DataSpaces = Record<DataSpaceName, AddressSpace>;

type TemporaryDataSpaces = Record<DataSpaceName, AddressSpace | undefined>;

type AllSpaceName = DataSpaceName | "programMemory" | "io";

type AllSpaces = Record<AllSpaceName, AddressSpace>;

type TemporarySpaces = Record<AllSpaceName, AddressSpace | undefined>;

const addressSpace = (memorySegment: xml_node): AddressSpace => {
    return {
        "start": attribute(memorySegment, "start"),
        "size": attribute(memorySegment, "size")
    };
}

const prog = (progSpec: xml_node): AddressSpace => {
    for (const memorySegment of progSpec["~children"]) {
        if (memorySegment["~name"] == "memory-segment") {
            if (attribute(memorySegment, "name") == "flash") {
                return addressSpace(memorySegment as xml_node);
            }
        }
    }
    throw new Error("didn't find program memory");
}

const data = (dataSpec: xml_node): DataSpaces => {
    const result: TemporaryDataSpaces = {
        "registers": undefined,
        "mappedIO": undefined,
        "internalRam": undefined
    };
    for (const memorySegment of dataSpec["~children"]) {
        if (memorySegment["~name"] == "memory-segment") {
            const dataSpaceName = dataSpaceNames[
                attribute(memorySegment, "name")
            ];
            if (dataSpaceName != undefined) {
                result[dataSpaceName] = addressSpace(memorySegment as xml_node);
            }
        }
    }
    for (const space in result) {
        if (result[space as DataSpaceName] == undefined) {
            throw new Error(`didn't find ${space} in data address space`);
        }
    }
    return result as DataSpaces;
}

export const addressSpaces = (addressSpaces: xml_node): AllSpaces => {
    const spaces: TemporarySpaces = {
        "programMemory": undefined,
        "registers": undefined,
        "mappedIO": undefined,
        "internalRam": undefined,
        "io": undefined
    };
    for (const space of addressSpaces["~children"]) {
        if (space["~name"] == "address-space") {
            switch (attribute(space, "name")) {
                case "prog":
                    spaces.programMemory = prog(space as xml_node);
                    break;
                case "data":
                    Object.assign(spaces, data(space as xml_node));
                    break;
                case "io":
                    spaces.io = addressSpace(space as xml_node);
                    break;
            }
        }
    }
    for (const space in spaces) {
        if (spaces[space as AllSpaceName] == undefined) {
            throw new Error(`didn't find ${space}`);
        }
    }
    return spaces as AllSpaces;
};
