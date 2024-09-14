import { fileStack } from "./file-stack.ts";
import type { FileName } from "./types.ts";

type Line = [FileName, number, string];

export const fileLoader = (topFileName: FileName) => {
    const files = fileStack();
    files.add(topFileName);

    const lines = function* (): Generator<Line, undefined, undefined> {
        let next: IteratorResult<[number, string]>;
        let file = files.file();
        while (file != undefined) {
            next = file[1].next();
            if (next.done) {
                files.drop();
            } else {
                const [lineNumber, rawLine] = next.value;
                yield [file[0], lineNumber, rawLine];
            }
            file = files.file();
        }
    };

    return {
        "include": files.add,
        "lines": lines
    };
};
