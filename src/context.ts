type ContextFunction = (n: number) => number;

interface Context {
    [name: string]: number | string | ContextFunction;
}

export const newContext = (): Context => {
    const context: Context = {};
    for (let i = 0; i < 32; i++) {
        context[`R${i}`] = i;
    }
    context.X = 26;
    context.Y = 28;
    context.Z = 30;
    context.LOW = (n) => n & 0xff;
    context.HIGH = (n) => (n >> 8) & 0xff;
    return context;
};
