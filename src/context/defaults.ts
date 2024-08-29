//import { GeneratedCode } from "../generate/mod.ts";

type ContextFunction = (n: number) => number;

type Context = Record<string, number | ContextFunction>;

const registers = (context: Context) => {
    const define = (name: string, value: number) =>
        Object.defineProperty(context, name, {
            "configurable": false,
            "enumerable": true,
            "value": value,
            "writable": false
        });

    for (let r = 0; r < 32; r++) {
        define(`R${r}`, r);
    }
    const specials: Array<[string, number]> = [
        ['X', 26],
        ['XL', 26],
        ['XH', 27],
        ['Y', 28],
        ['YL', 28],
        ['YH', 29],
        ['Z', 30],
        ['ZL', 30],
        ['ZH', 31]
    ];
    for (const [name, value] of specials) {
        define(name, value);
    }
};

export const defaults = (): Context => {
    const context: Context = {
        "LOW": (n) => n & 0xff,
        "HIGH": (n) => (n >> 8) & 0xff,
        "flashOrg": 0,
        "ramOrg": 0
    };
    registers(context);
    return context;
};
