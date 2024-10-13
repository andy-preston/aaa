import { passes, process, startPass } from "../process/mod.ts";

import { closeOutput, newOutput, output, listSource } from "../output/mod.ts";

import {
    type FileName,
    languageSplit, sourceLines, splitterCheck
} from "../source-code/mod.ts";

export const cli = (commandLineSourceFile: FileName) => {
    for (const pass of passes) {
        // TODO: pass should not be stateful
        // pass is going to be part of the line object
        startPass(pass);

        if (pass == 2) {
            newOutput(commandLineSourceFile);
        }
        const eachLine = sourceLines(pass, commandLineSourceFile);
        for (const line of eachLine()) {
            if (pass == 2) {
                listSource(
                    line.filename,
                    line.lineNumber,
                    line.rawLine
                );
            }
            languageSplit(line);
            for (const [address, code, errorMessages] of process(line.rawLine)) {
                if (pass == 2) {
                    output(address, code, errorMessages);
                }
            }
        }
        if (pass == 2) {
            closeOutput();
        }
        splitterCheck();
    }
};
