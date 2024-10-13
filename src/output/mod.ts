import type { FileName } from "../coupling/coupling.ts";
import type { CodeBlock } from "../translate/mod.ts";
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

export const output = (block: CodeBlock) => {
    listCode(block.address, block.code);
    for (const message of block.errors) {
        listError(message);
        anyErrors = true;
    }
    if (!anyErrors) {
        codeForHex(block.address, block.code);
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
