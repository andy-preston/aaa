import { InternalError } from "../errors/errors.ts";

export type FileName = string;

export type LineNumber = number;

export type RawSource = string;

type StackEntry = [FileName, IterableIterator<[LineNumber, RawSource]>];

let fileStack: Array<StackEntry> = [];

const stackEntry = (fileName: FileName): StackEntry => ([
    fileName,
    Deno.readTextFileSync(fileName).split("\n").entries()
]);

const currentFile = (): StackEntry | undefined =>
    fileStack.length == 0 ? undefined : fileStack[fileStack.length - 1]

export const includeFile = (fileName: FileName) => {
    fileStack.push(stackEntry(fileName));
};

export const fileStackCheck = () => {
    if (currentFile() != undefined) {
        throw new InternalError(`Source code file stack not empty`);
    }
};

export const newLine = (
    filename: FileName,
    lineNumber: LineNumber,
    rawLine: RawSource,
) => ({
    "filename": filename,
    "lineNumber": lineNumber,
    "rawLine": rawLine
});

export type Line = ReturnType<typeof newLine>;

export const sourceLines = (fileName: FileName) => {
    fileStack = [stackEntry(fileName)];
    return function* (): Generator<Line, undefined, undefined> {
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
};
