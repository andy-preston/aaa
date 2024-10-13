import type { FileName } from "../coupling/coupling.ts";
import type { GeneratedCode } from "../generate/mod.ts";
import { closeFile, openFile, writeFile } from "./file.ts";
import { codeForHex, newHexFile, saveHexFile } from "./hex.ts";
import { listCode, listError, newListing } from "./listing.ts";

export { listSource } from "./listing.ts";

let baseName: string;
let anyErrors: boolean;

export const newOutput = (topFileName: FileName) => {
    baseName = topFileName;
    openFile(baseName, ".lst");
    newListing(writeFile);
    newHexFile();
    anyErrors = false;
};

export const output = (
    address: number,
    code: GeneratedCode,
    errors: Array<string>
) => {
    listCode(address, code);
    for (const message of errors) {
        listError(message);
        anyErrors = true;
    }
    if (!anyErrors) {
        codeForHex(address, code);
    }
};

export const closeOutput = () => {
    closeFile();
    if (!anyErrors) {
        openFile(baseName, ".hex");
        saveHexFile(writeFile);
        closeFile();
    }
};
