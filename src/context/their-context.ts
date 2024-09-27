import type { Directive } from "../directives/mod.ts";

type SimpleFunction = (_: number) => number;

export interface TheirContext {
    "low": (n: number) => number;
    "high": (n: number) => number;
    "programEnd": number;
    [x: string]: number | SimpleFunction | Directive;
}

export const addDirective = (
    theirs: TheirContext,
    name: string,
    directive: Directive
) => {
    theirs[name] = directive;
};

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
        // some devices have more flash than 0xffff
        // but our current .HEX output only goes that far :/
        "programEnd": Math.floor(0xffff / 2)
    };
    for (let r = 0; r < 32; r++) {
        addProperty(theirs, `R${r}`, r);
    }
    const specialRegisters: Array<[string, number]> = [
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
    for (const [name, value] of specialRegisters) {
        addProperty(theirs, name, value);
    }
    return theirs;
};
