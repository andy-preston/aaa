import { openOutput } from "../output/mod.ts";
import { newState, passes } from "../state/mod.ts";
import { sourceLines, sourceCheck } from "../source-code/mod.ts";
import type { FileName } from "./coupling.ts";
import { codeBlockGenerator } from "../translate/mod.ts";

export const cli = (commandLineSourceFile: FileName) => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    passes.forEach(pass => {
        state.pass.start(pass);
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
