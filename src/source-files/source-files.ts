export type FileName = string;

type LineNumber = number;

type RawSource = string;

type Line = [FileName, LineNumber, RawSource];

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

export const topFile = (fileName: FileName) => {
    fileStack = [stackEntry(fileName)];
}

export const inputLines = function* (): Generator<Line, undefined, undefined> {
    let next: IteratorResult<[LineNumber, RawSource]>;
    let file = currentFile();
    while (file != undefined) {
        next = file[1].next();
        if (next.done) {
            fileStack.pop();
        } else {
            const [lineNumber, rawLine] = next.value;
            yield [file[0], lineNumber, rawLine];
        }
        // Bear in mind that another file could have been pushed on top
        // by an include directive "whilst we weren't watching"
        file = currentFile();
    }
};
