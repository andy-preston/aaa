export type ProgramCounter = number;

type ContextFunction = (n: number) => number;

export interface Context {
    [name: string]: number | ContextFunction;
}
