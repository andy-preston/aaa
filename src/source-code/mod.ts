export { macroLines } from "./macro.ts";
export type { Line, Mnemonic } from "./line.ts";

import type { FileName } from "../file-name.ts";
import type { Context } from "../state/context.ts";
import { languageSplitter } from "./language-split.ts";
import type { LineGenerator } from "./line.ts";
import { fileStack } from "./raw-lines.ts";
import { lineTokens } from "./tokens.ts";

export const sourceLines = (context: Context) => {
    const splitter = languageSplitter(context);
    const files = fileStack();

    const lines = function* (fileName: FileName): LineGenerator {
        for (const line of files.rawLines(fileName)) {
            splitter.split(line);
            lineTokens(line);
            yield line;
        }
    };

    const check = () => {
        files.check();
        splitter.check();
    };

    return {
        "includeFile": files.includeFile,
        "lines": lines,
        "check": check
    };
};
