import type { DirectiveHandler } from "../directives/mod.ts";

type SimpleFunction = (_: number) => number;

interface TheirContext {
    "low": (n: number) => number;
    "high": (n: number) => number;
    "flashOrg": number;
    "ramOrg": number;
    [x: string]: number | SimpleFunction | DirectiveHandler;
}

const registers = (theirContext: TheirContext) => {
    const define = (name: string, value: number) =>
        Object.defineProperty(theirContext, name, {
            "configurable": false,
            "enumerable": true,
            "value": value,
            "writable": false
        });

    for (let r = 0; r < 32; r++) {
        define(`R${r}`, r);
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
        define(name, value);
    }
};

export const createTheirContext = (): TheirContext => {
    const theirContext: TheirContext = {
        "low": (n) => n & 0xff,
        "high": (n) => (n >> 8) & 0xff,
        "flashOrg": 0,
        "ramOrg": 0
    };
    registers(theirContext);
    return theirContext;
};
