export { macroLines } from "./macro.ts";
export { includeFile } from "./raw-lines.ts";
export type { Line, Mnemonic } from "./line.ts";

import type { FileName } from "../coupling/coupling.ts";
import { languageSplit, splitterCheck } from "./language-split.ts";
import type { LineGenerator } from "./line.ts";
import { fileStackCheck, rawLines } from "./raw-lines.ts";
import { lineTokens } from "./tokens.ts";

export const sourceLines = function* (fileName: FileName): LineGenerator {
    for (const line of rawLines(fileName)) {
        languageSplit(line);
        lineTokens(line);
        yield line;
    }
};

export const sourceCheck = () => {
    fileStackCheck();
    splitterCheck();
};
