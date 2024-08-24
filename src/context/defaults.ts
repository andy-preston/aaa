//import { GeneratedCode } from "../generate/mod.ts";

type ContextFunction = (n: number) => number;

type Context = Record<string, number|ContextFunction>;

const registers = (context: Context) => {
    for (let r = 0; r < 32; r++) {
        Object.defineProperty(context, `R${r}`, {
            "configurable": false,
            "value": r,
            "writable": false
        });
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
    for (const [name, index] of specials) {
        Object.defineProperty(context, name, {
            "configurable": false,
            "value": index,
            "writable": false
        });
    }
}

export const defaults = (): Context => {
    const context: Context = {};
    registers(context);
    context.LOW = (n) => n & 0xff;
    context.HIGH = (n) => (n >> 8) & 0xff;
    context.flashOrg = 0;
    context.ramOrg = 0;
    return context;
};
