import { coupling } from "./coupling.ts";
import { programMemoryOrigin } from "./generate/mod.ts";
import { setPass } from "./operands/mod.ts";
import { closeOutput, newOutput, output, listSource } from "./output/mod.ts";
import { languageSplit, sourceLines, topFile} from "./source-code/mod.ts";

const commandLineSourceFile = "./file1.txt";

const process = coupling();

for (const pass of [1, 2]) {
    if (pass == 2) {
        programMemoryOrigin(0);
        setPass(pass);
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
