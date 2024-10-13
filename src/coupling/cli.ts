import { process } from "../translate/mod.ts";
import { closeOutput, newOutput, output, listSource } from "../output/mod.ts";
import { passes, startPass } from "../state/mod.ts";
import { sourceLines, sourceCheck } from "../source-code/mod.ts";
import type { FileName } from "./coupling.ts";

export const cli = (commandLineSourceFile: FileName) => {
    for (const pass of passes) {
        // TODO: pass should not be stateful
        // pass is going to be part of the line object
        startPass(pass);

        if (pass == 2) {
            newOutput(commandLineSourceFile);
        }
        for (const line of sourceLines(commandLineSourceFile)) {
            if (pass == 2) {
                listSource(line);
            }
            for (const processed of process(line)) {
                if (pass == 2) {
                    output(processed);
                }
            }
        }
        if (pass == 2) {
            closeOutput();
        }
        sourceCheck();
    }
};
