import type { Directive } from "../directives/mod.ts";

type SimpleFunction = (_: number) => number;

interface TheirContext {
    "low": (n: number) => number;
    "high": (n: number) => number;
    "programMemoryPos": number;
    "dataMemoryPos": number;
    [x: string]: number | SimpleFunction | Directive;
}

export const addProperty = (
    theirs: TheirContext,
    name :string,
    value: number
) => {
    Object.defineProperty(theirs, name, {
        "configurable": false,
        "enumerable": true,
        "value": value,
        "writable": false
    });
};

export const theirContext = (): TheirContext => {
    const theirs: TheirContext = {
        "low": (n) => n & 0xff,
        "high": (n) => (n >> 8) & 0xff,
        "programMemoryPos": 0,
        "dataMemoryPos": 0
    };
    for (let r = 0; r < 32; r++) {
        addProperty(theirs, `R${r}`, r);
    }
    const specials: Array<[string, number]> = [
        ["X", 26],
        ["XL", 26],
        ["XH", 27],
        ["Y", 28],
        ["YL", 28],
        ["YH", 29],
        ["Z", 30],
        ["ZL", 30],
        ["ZH", 31]
    ];
    for (const [name, value] of specials) {
        addProperty(theirs, name, value);
    }
    return theirs;
};
