export type StringDirective = (s: string) => void;

export type ArrayDirective = (a: Array<number>) => void;

export type Directive = StringDirective | ArrayDirective;
