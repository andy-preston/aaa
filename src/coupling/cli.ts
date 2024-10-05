import { passes, process, startPass } from "../process/mod.ts";

import { closeOutput, newOutput, output, listSource } from "../output/mod.ts";

import {
    type FileName,
    languageSplit,
    sourceLines,
    topFile
} from "../source-code/mod.ts";

export const cli = (commandLineSourceFile: FileName) => {
    for (const pass of passes) {
        startPass(pass);
        if (pass == 2) {
            newOutput(commandLineSourceFile);
        }
        topFile(commandLineSourceFile);
        for (const [fileName, lineNumber, rawLine] of sourceLines()) {
            const line = languageSplit(rawLine);
            if (pass == 2) {
                listSource(fileName, lineNumber, rawLine);
            }
            for (const [address, code, errorMessages] of process(line)) {
                if (pass == 2) {
                    output(address, code, errorMessages);
                }
            }
        }
        if (pass == 2) {
            closeOutput();
        }
    }
};
