import { type xml_node, parse } from "xml";

export const spec = (fileName: string) => {
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
};
