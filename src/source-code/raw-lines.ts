import { InternalError } from "../errors/errors.ts";
import type { FileName } from "../file-name.ts";
import {
    type LineGenerator, type LineNumber, type RawSource,
    newLine
} from "./line.ts";

type StackEntry = [FileName, IterableIterator<[LineNumber, RawSource]>];

export const fileStack = () => {
    let fileStack: Array<StackEntry> = [];

    const stackEntry = (fileName: FileName): StackEntry => ([
        fileName,
        Deno.readTextFileSync(fileName).split("\n").entries()
    ]);

    const currentFile = (): StackEntry | undefined =>
        fileStack.length == 0 ? undefined : fileStack[fileStack.length - 1]

    const includeFile = (fileName: FileName) => {
        fileStack.push(stackEntry(fileName));
    };

    const check = () => {
        if (currentFile() != undefined) {
            throw new InternalError(`Source code file stack not empty`);
        }
    };

    const rawLines = function* (fileName: FileName): LineGenerator {
        fileStack = [stackEntry(fileName)];
        let file = currentFile();
        while (file != undefined) {
            const next = file[1].next();
            if (next.done) {
                fileStack.pop();
            } else {
                const [lineNumber, rawLine] = next.value;
                yield newLine(file[0], lineNumber, rawLine);
            }
            // Bear in mind that another file could have been pushed on top
            // by an include directive "whilst we weren't watching"
            file = currentFile();
        }
    };

    return {
        "includeFile": includeFile,
        "check": check,
        "rawLines": rawLines
    };
};
