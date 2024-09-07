import { parse } from "xml";

for (const directory of ["attiny", "atmega"]) {
    const path = `./build/packs/${directory}`;
    for (const entry of Deno.readDirSync(path)) {
        const fileName = entry.name;
        using file = Deno.openSync(`${path}/${fileName}`);
        const parsed = parse(file);
        console.log(Object.keys(parsed["avr-tools-device-file"]));

    }
}
