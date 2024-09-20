import type { GeneratedCode } from "../generate/mod.ts";
import type { FileName } from "../input/mod.ts";
import { outputFile } from "./file.ts";
import { intelHex } from "./hex.ts";
import { lister } from "./lister.ts";

export const outputter = (fileName: FileName) => {
    const listFile = outputFile(fileName, ".lst");
    const listing = lister(listFile.writeLine);
    const hex = intelHex();
    let anyErrors = false;

    const source = (fileName: FileName, line: number, source: string) => {
        listing.sourceFile(fileName, line, source);
    };

    const output = (address: number, code: GeneratedCode, error: string) => {
        listing.aLine(address, code, error);
        if (error) {
            anyErrors = true;
        }
        if (!anyErrors) {
            hex.add(address, code);
        }
    };

    const close = () => {
        listFile.close();
        if (!anyErrors) {
            const hexFile = outputFile(fileName, ".hex");
            hex.save(hexFile.writeLine);
            hexFile.close();
        }
    };

    return { "source": source, "output": output, "close": close };
};

export type Output = ReturnType<typeof outputter>["output"];
