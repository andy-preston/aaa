type ContextFunction = (n: number) => number;

export interface Context {
    [name: string]: number | ContextFunction;
}

export const defaults = (): Context => {
    const context: Context = Object.fromEntries(
        [...Array(32).keys()].map((register) => [`R${register}`, register])
    );
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
    context.flashOrg = 0;
    context.ramOrg = 0;
    return context;
};
