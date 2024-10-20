import type { FileName } from "../file-name.ts";
import type { CodeBlock } from "../translate/mod.ts";
import { file } from "./file.ts";
import { type Hex, newHexFile } from "./hex.ts";
import { openListing } from "./listing.ts";

export const openOutput = (topFileName: FileName) => {
    const listingFile = file(topFileName, ".lst");
    const listing = openListing(listingFile);
    let hex: Hex | undefined = newHexFile();

    const codeBlock = (block: CodeBlock) => {
        if (block.errors.length > 0) {
            hex = undefined;
        }
        listing.codeBlock(block);
        hex?.codeBlock(block);
    };

    const close = () => {
        listingFile.close();
        if (hex) {
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
