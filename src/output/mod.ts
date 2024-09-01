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

    const output = (
        sourceFile: FileName,
        lineNumber: number,
        address: number,
        generatedCode: GeneratedCode,
        source: string,
        errorMessage: string
    ) => {
        listing(
            sourceFile,
            lineNumber,
            address,
            generatedCode,
            source,
            errorMessage
        );
        if (errorMessage) {
            anyErrors = true;
        }
        if (!anyErrors) {
            hex.add(address, generatedCode);
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

    return { "output": output, "close": close };
};

export type Output = ReturnType<typeof outputter>["output"];
