import type { FileName } from "../coupling/coupling.ts";
import type { CodeBlock } from "../translate/mod.ts";
import { file } from "./file.ts";
import { newHexFile } from "./hex.ts";
import { openListing } from "./listing.ts";

export const openOutput = (topFileName: FileName) => {
    let anyErrors = false;
    const listingFile = file(topFileName, ".lst");
    const listing = openListing(listingFile);
    const hex = newHexFile();

    const codeBlock = (block: CodeBlock) => {
        listing.codeBlock(block);
        for (const message of block.errors) {
            listing.error(message);
            anyErrors = true;
        }
        if (!anyErrors) {
            hex.codeBlock(block);
        }
    };

    const close = () => {
        listingFile.close();
        if (!anyErrors) {
            const hexFile = file(topFileName, ".hex");
            hex.save(hexFile.write);
            hexFile.close();
        }
    };

    return {
        "source": listing.source,
        "codeBlock": codeBlock,
        "close": close
    };
};

export type Output = ReturnType<typeof openOutput>;
