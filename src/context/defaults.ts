import { Context } from "./types.ts";

export const defaults = (): Context => {
    const context: Context = {};
    for (let i = 0; i < 32; i++) {
        context[`R${i}`] = i;
    }
    context.X = 26;
    context.XL = 26;
    context.XH = 27;
    context.Y = 28;
    context.YL = 28;
    context.YH = 29;
    context.Z = 30;
    context.ZL = 30;
    context.ZH = 31;
    context.LOW = (n) => n & 0xff;
    context.HIGH = (n) => (n >> 8) & 0xff;
    return context;
};

