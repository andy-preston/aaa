import { process } from "../translate/mod.ts";
import { openOutput } from "../output/mod.ts";
import { passes, startPass } from "../state/mod.ts";
import { sourceLines, sourceCheck } from "../source-code/mod.ts";
import type { FileName } from "./coupling.ts";

export const cli = (commandLineSourceFile: FileName) => {
    for (const pass of passes) {
        startPass(pass);
        const output = pass == 2
            ? openOutput(commandLineSourceFile)
            : undefined;
        for (const line of sourceLines(commandLineSourceFile)) {
            if (output) {
                output.source(line);
            }
            for (const codeBlock of process(line)) {
                if (output) {
                    output.codeBlock(codeBlock);
                }
            }
        }
        if (output) {
            output.close();
        }
        sourceCheck();
    }
};
