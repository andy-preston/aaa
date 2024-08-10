type ContextFunction = (n: number) => number;

export interface Context {
    [name: string]: number | string | ContextFunction;
}
