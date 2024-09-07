import { parse, xml_node, xml_text } from "xml";

const spec = (fileName: string) => {
    using file = Deno.openSync(fileName);
    const parsed = parse(file, {
        "clean": {
            "comments": true,
            "doctype": true,
            "instructions": true
        }
    });
    const spec = parsed["avr-tools-device-file"] as xml_node;
    let device: undefined | xml_node = undefined;
    let modules: undefined | xml_node = undefined;
    for (const section of spec["~children"]) {
        if (section["~name"] == "modules") {
            modules = section as xml_node;
        }
        else if (section["~name"] == "devices") {
            const devices = section as xml_node;
            if (devices["~children"].length > 1) {
                throw new Error("don't know what to do with multiple devices");
            }
            device = devices["~children"][0] as xml_node;

        }
    }
    if (device == undefined) {
        throw new Error("didn't find a device");
    }
    if (modules == undefined) {
        throw new Error("didn't find modules")
    }
    return [device as xml_node, modules as xml_node]
}

const attribute = (node: xml_node | xml_text, attributeName: string): string =>
    ((node as xml_node)[`@${attributeName}`] as string).toLowerCase()

interface AddressSpace {
    "start": string,
    "size": string
};

interface DataAddressSpaces {
    "registers": AddressSpace,
    "mappedIO": AddressSpace, // When using IN and OUT start is 0000
    "internalRam": AddressSpace
};

interface AllAddressSpaces {
    "programMemory": AddressSpace,
    "dataMemory": DataAddressSpaces,
    "io": AddressSpace
};

const addressSpace = (memorySegment: xml_node): AddressSpace => {
    return {
        "start": attribute(memorySegment, "start"),
        "size": attribute(memorySegment, "size")
    };
}

const progAddressSpace = (prog: xml_node): AddressSpace => {
    for (const memorySegment of prog["~children"]) {
        if (memorySegment["~name"] == "memory-segment") {
            if (attribute(memorySegment, "name") == "flash") {
                return addressSpace(memorySegment as xml_node);
            }
        }
    }
    throw new Error("didn't find program memory");
}

const dataAddressSpace = (data: xml_node): DataAddressSpaces => {
    let registers: AddressSpace | undefined = undefined;
    let mappedIO: AddressSpace | undefined = undefined;
    let iRam: AddressSpace | undefined = undefined;
    for (const memorySegment of data["~children"]) {
        if (memorySegment["~name"] == "memory-segment") {
            switch (attribute(memorySegment, "name")) {
                case "registers":
                    registers = addressSpace(memorySegment as xml_node);
                    break;
                case "mapped_io":
                    mappedIO = addressSpace(memorySegment as xml_node);
                    break;
                case "iram":
                    iRam = addressSpace(memorySegment as xml_node);
                    break;
            }
        }
    }
    if (registers == undefined) {
        throw new Error("didn't find registers address space");
    }
    if (mappedIO == undefined) {
        throw new Error("didn't find Mapped IO address space");
    }
    if (iRam == undefined) {
        throw new Error("didn't find IRAM address space");
    }
    return {
        "registers": registers as AddressSpace,
        "mappedIO": mappedIO as AddressSpace,
        "internalRam": iRam as AddressSpace
    };
}

const addressSpaces = (addressSpaces: xml_node): AllAddressSpaces => {
    let programMemory: AddressSpace | undefined = undefined;
    let dataMemory: DataAddressSpaces | undefined = undefined;
    let ioMemory: AddressSpace | undefined = undefined;
    for (const space of addressSpaces["~children"]) {
        if (space["~name"] == "address-space") {
            switch (attribute(space, "name")) {
                case "prog":
                    programMemory = progAddressSpace(space as xml_node);
                    break;
                case "data":
                    dataMemory = dataAddressSpace(space as xml_node);
                    break;
                case "io":
                    ioMemory = addressSpace(space as xml_node);
                    break;
            }

        }
    }
    if (programMemory == undefined) {
        throw new Error("didn't find program memory");
    }
    if (dataMemory == undefined) {
        throw new Error("didn't find data memory");
    }
    if (ioMemory == undefined) {
        throw new Error("didn't find IO memory");
    }
    return {
        "programMemory": programMemory,
        "dataMemory": dataMemory,
        "io": ioMemory
    };
};

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
