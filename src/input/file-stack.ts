import type { FileName } from "./types.ts";

type StackEntry = [FileName, IterableIterator<[number, string]>];

export const fileStack = () => {
    const theStack: Array<StackEntry> = [];

    return {
        "add": (fileName: string) => {
            theStack.push([
                fileName,
                Deno.readTextFileSync(fileName).split("\n").entries()
            ]);
        },
        "drop": () => {
            theStack.pop();
        },
        "file": (): StackEntry | undefined =>
           theStack.length == 0 ? undefined : theStack[theStack.length - 1]
    };
};
