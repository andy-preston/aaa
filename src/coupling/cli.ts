import { codeBlocksFrom } from "../translate/mod.ts";
import { openOutput } from "../output/mod.ts";
import { passes, startPass } from "../state/mod.ts";
import { sourceLines, sourceCheck } from "../source-code/mod.ts";
import type { FileName } from "./coupling.ts";

export const cli = (commandLineSourceFile: FileName) => {
    passes.forEach(pass => {
        startPass(pass);
        const output = pass == 2
            ? openOutput(commandLineSourceFile)
            : undefined;
        sourceLines(commandLineSourceFile).forEach(line => {
            output?.source(line);
            codeBlocksFrom(line).forEach(block => {
                output?.codeBlock(block);
            });
        });
        output?.close();
        sourceCheck();
    });
};
